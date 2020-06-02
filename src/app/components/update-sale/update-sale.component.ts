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
  oldCantDisponible: number = 0;
  oldCant: number;
  listaAlmacenes: any = [];
  productosVenta: any = [];
  productosAnteriores: any = [];
  productoVenta: any = {};
  facturaCompleta: any = [];
  venta: any = { };  
  prodActualizar: any = {
    cantidadDisponible: 0
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
  nombreAlmacen: any;
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
          this.productoService.get(producto.productoid).subscribe(data => {
            this.error = false;
            this.oldCantDisponible = data.cantidadDisponible;
            console.log(this.oldCantDisponible);
            this.prodActualizar = {
              referencia: producto.productoid,
              cantidadDisponible: (this.oldCantDisponible + producto.cantidad)
            };
            this.productosAnteriores.push(this.prodActualizar);
          }, err => {
            this.guardando = false;
            this.error = true;
          })
        })
        console.log(this.venta);
        
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
    this.almacenSelect = true;
    this.venta.productoid = null;
    this.productoEncontrado = [];
    this.almacenService.get(this.venta.almacenid).subscribe(data => {
      this.detalle = data[0].name;
    });
    this.prodAlmacenService.get(this.venta.almacenid).subscribe(data => {
      this.items = data;
    });
  }

  buscarProducto() {
    this.productoService.get(this.venta.productoid).subscribe(data => {
      this.productoEncontrado = data;
    });
  }

  saveProduct(producto, f: NgForm) {
    this.aux = this.productosVenta.filter(product => product.productoid == producto.referencia);
    this.oldCant = 0;
    if (this.aux.length > 0) {
      this.oldCant = this.aux[0].cantidad;
    }
    producto.cantidad = f.value.first + this.oldCant;
    
    //console.log(this.productosVenta);   producto.cantidadDisponible
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
    const productoEliminar = this.facturaCompleta.filter( producto => producto.productoid == ref );
    this.venta.neto = this.venta.neto - (productoEliminar.length > 0 ? productoEliminar[0].precioNeto : 0);
    this.facturaCompleta = this.facturaCompleta.filter(producto => producto.productoid != ref);
    this.venta.itemVenta = this.facturaCompleta;
    this.productosVenta = this.productosVenta.filter(producto => producto.productoid != ref);
  }

  updateSale() {
    this.cantidadCorrecta = true;
    
    this.productosVenta.forEach(producto => {
      if (producto.cantidadDisponible < producto.cantidad) {
        this.cantidadCorrecta = false;
        console.log(this.cantidadCorrecta);
      }
    })
    if (this.cantidadCorrecta) {
      this.guardando = true;
      this.productosAnteriores.forEach(product => {
        this.productoService.update(product).subscribe(data => {
          this.error = false;
          console.log(data);
        }, err => {
          this.guardando = false;
          this.error = true;
        });
      })
      console.log(this.cantidadCorrecta);
      
      console.log(this.venta);
      console.log(this.venta.neto);
      this.saleService.update(this.venta).subscribe(data => {
        this.error = false;
        console.log(data);
        console.log(data.itemVenta);
        data.itemVenta.forEach(element => {
          console.log(element);
          this.productoService.get(element.productoid).subscribe(data => {
            this.error = false;
            this.oldCantDisponible = data.cantidadDisponible;
            console.log(this.oldCantDisponible);
            this.prodActualizar = {
              referencia: element.productoid,
              cantidadDisponible: (this.oldCantDisponible - element.cantidad)
            };
            this.productoService.update(this.prodActualizar).subscribe(data => {
              this.error = false;
              console.log(data);
            }, err => {
              this.guardando = false;
              this.error = true;
            });
          }, err => {
            this.guardando = false;
            this.error = true;
          })
        })
        this.router.navigate(['/sale']);
      }, err => {
        this.guardando = false;
        this.error = true;
      });
    } else {
      this.mensaje = "Por favor verifique la cantidad de cada producto con su cantidad disponible";
    }
  }

  onSubmit(f: NgForm) {
    console.log(f.value);
  }
}

/**
 * 
          
          
 */