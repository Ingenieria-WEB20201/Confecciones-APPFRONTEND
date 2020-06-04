import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { NgForm } from '@angular/forms';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProductoAlmacenService } from 'src/app/services/producto-almacen.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-update-sale',
  templateUrl: './update-sale.component.html',
  styleUrls: ['./update-sale.component.css']
})
export class UpdateSaleComponent implements OnInit {

  cantidad: number;
  oldCant: number;
  productosVenta: any = [];
  productoVenta: any = {};
  facturaCompleta: any = [];
  venta: any = {};
  items: any[] = [];
  productoEncontrado: any;
  almacenSelect: boolean = false;
  guardando = false;
  error = false;
  cantidadCorrecta = true;
  mensaje: string;
  aux: any;
  nombreAlmacen: any;
  productoBuscadoid: any;
  
  constructor(private route: ActivatedRoute, private router: Router, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService,
    private productoService: ProductoService, private prodAlmacenService: ProductoAlmacenService, private saleService: SaleService) { }


  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.error = false;
    this.route.params.subscribe(params => {
      this.saleService.getById(params.id).subscribe(data => {
        this.venta = data;
        this.venta.itemVenta.forEach(producto => {
          this.productosVenta.push(producto);
          this.facturaCompleta.push(producto);
        })
        this.prodAlmacenService.get(this.venta.almacenid).subscribe(data => {
          this.items = data;
        }, err => {
          this.error = true;
        });
        this.almacenService.get(this.venta.almacenid).subscribe(almacen => {
          this.nombreAlmacen = almacen[0].name;
        }, err => {
          this.error = true;
        });
      }, err => {
        this.error = true;
      });
    });
  }

  listarAlamacen() {
    this.mensaje = "";
    this.almacenSelect = true;
    this.productoBuscadoid = null;
    this.productoEncontrado = [];
  }

  buscarProducto() {
    this.items.forEach(producto => {
      if (producto[0].referencia == this.productoBuscadoid) {
        this.productoEncontrado = producto;
      }
    })
  }

  saveProduct(producto, f: NgForm) {
    this.aux = this.productosVenta.filter(product => product.productoid == producto.referencia);
    this.oldCant = 0;

    if (this.aux.length > 0) {
      this.oldCant = this.aux[0].cantidad;
    }
    producto.cantidad = f.value.first + this.oldCant;
    this.deleteProduct(producto.referencia);

    this.productoVenta = {
      productoid: producto.referencia,
      precioUnitario: producto.precioVenta,
      cantidad: producto.cantidad,
      precioNeto: (producto.precioVenta * producto.cantidad)
    };
    this.productosVenta.push(this.productoVenta);
    this.facturaCompleta.push(this.productoVenta);
    this.venta.neto = this.venta.neto + this.productoVenta.precioNeto;
    this.venta.itemVenta = this.facturaCompleta;
  }

  deleteProduct(ref: any) {
    this.mensaje = "";
    const productoEliminar = this.facturaCompleta.filter(producto => producto.productoid == ref);
    this.venta.neto = this.venta.neto - (productoEliminar.length > 0 ? productoEliminar[0].precioNeto : 0);
    this.facturaCompleta = this.facturaCompleta.filter(producto => producto.productoid != ref);
    this.venta.itemVenta = this.facturaCompleta;
    this.productosVenta = this.productosVenta.filter(producto => producto.productoid != ref);
  }

  updateSale() {
    this.cantidadCorrecta = true;

    this.productosVenta.forEach(product => {
      this.items.forEach(producto => {
        if (producto[0].referencia == product.productoid) {
          if (producto[0].cantidadDisponible < product.cantidad) {
            this.cantidadCorrecta = false;
          }
        }
      })
    })
    if (this.cantidadCorrecta) {
      this.guardando = true;
      this.saleService.update(this.venta).subscribe(data => {
        this.error = false;        
      }, err => {
        this.guardando = false;
        this.error = true;
      });
      this.router.navigate(['/sale']);
    } else {
      this.mensaje = "Por favor verifique la cantidad de cada producto con su cantidad disponible";
    }
  }
}