import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { NgForm } from '@angular/forms';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProductoAlmacenService } from 'src/app/services/producto-almacen.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {

  cantidad: number;
  oldCant: number;
  listaAlmacenes: any = [];
  productosVenta: any = [];
  productoVenta: any = {};
  facturaCompleta: any = [];
  venta: any = {
    neto: 0
  };
  items: any[] = [];
  detalle: any;
  productoEncontrado: any = [];
  almacenSelect: boolean = false;
  guardando = false;
  error = false;
  cantidadCorrecta = true;
  mensaje: string;
  aux: any;
  productoBuscadoid: any;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService,
    private productoService: ProductoService, private prodAlmacenService: ProductoAlmacenService, private saleService: SaleService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.venta.userid = this.tokenStorageService.getUser().id;
    this.almacenService.getByUser(this.venta.userid).subscribe(data => {
      this.listaAlmacenes = data;
    });

  }

  onSubmit(f: NgForm) {
    console.log(f.value);
  }

  listarAlamacen() {
    this.mensaje = "";
    this.almacenSelect = true;
    this.productoBuscadoid = null;
    this.productoEncontrado = [];
    this.almacenService.get(this.venta.almacenid).subscribe(data => {
      this.detalle = data[0].name;
    });
    this.prodAlmacenService.get(this.venta.almacenid).subscribe(data => {
      this.items = data;
    });
  }

  buscarProducto() {
    this.items.forEach(producto => {
      if (producto[0].referencia == this.productoBuscadoid) {
        this.productoEncontrado = producto;
      }
    });
  }

  saveProduct(producto, f: NgForm) {
    this.aux = this.productosVenta.filter(product => product.referencia == producto.referencia);
    this.oldCant = 0;
    if (this.aux.length > 0) {
      this.oldCant = this.aux[0].cantidad;
    }
    producto.cantidad = f.value.first + this.oldCant;
    this.deleteProduct(producto.referencia);
    this.productosVenta.push(producto);
    this.productoVenta = {
      productoid: producto.referencia,
      precioUnitario: producto.precioVenta,
      cantidad: producto.cantidad,
      precioNeto: (producto.precioVenta * producto.cantidad)
    };
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
    this.productosVenta = this.productosVenta.filter(producto => producto.referencia != ref);
  }

  saveSale() {
    this.cantidadCorrecta = true;

    this.productosVenta.forEach(producto => {
      if (producto.cantidadDisponible < producto.cantidad) {
        this.cantidadCorrecta = false;
      }
    })
    if (this.cantidadCorrecta) {
      let fecha = new Date();
      let dd = fecha.getDate();
      let mm = fecha.getMonth() + 1;
      let yyyy = fecha.getFullYear();
      this.venta.fecha = mm + '/' + dd + '/' + yyyy;
      this.guardando = true;
      this.saleService.create(this.venta).subscribe(data => {
        this.error = false;
        this.router.navigate(['/sale']);
      }, err => {
        this.guardando = false;
        this.error = true;
      });
    } else {
      this.mensaje = "Por favor verifique la cantidad de cada producto con su cantidad disponible";
    }
  }
}
