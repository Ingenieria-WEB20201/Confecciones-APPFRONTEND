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
  oldCantDisponible: number = 0;
  oldCant: number;
  listaAlmacenes: any = [];
  productosVenta: any = [];
  productoVenta: any = {};
  facturaCompleta: any = [];
  venta: any = {
    neto: 0
  };  
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
  constructor(private router: Router, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService,
    private productoService: ProductoService, private prodAlmacenService: ProductoAlmacenService, private saleService: SaleService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.venta.userid = this.tokenStorageService.getUser().id;
    //this.almacenService.getAll().subscribe(data => {
    this.almacenService.getByUser(this.venta.userid).subscribe(data => {
      this.listaAlmacenes = data;
    });

  }

  onSubmit(f: NgForm) {
    console.log(f.value);
  }

  listarAlamacen() {
    this.almacenSelect = true;
    this.venta.productoid = null;
    this.productoEncontrado = [];
    this.almacenService.get(this.venta.almacenid).subscribe(data => {
      this.detalle = data[0].name;
      console.log(data[0].name);
    });
    this.prodAlmacenService.get(this.venta.almacenid).subscribe(data => {
      this.items = data;
      console.log(data);
    });
  }

  buscarProducto() {
    this.productoService.get(this.venta.productoid).subscribe(data => {
      this.productoEncontrado = data;
      console.log(data);
    });
  }

  saveProduct(producto, f: NgForm) {
    this.aux = this.productosVenta.filter(product => product.referencia == producto.referencia);
    this.oldCant = 0;
    if (this.aux.length > 0) {
      this.oldCant = this.aux[0].cantidad;
    }
    //console.log(f.value.first);
    producto.cantidad = f.value.first + this.oldCant;
    
    //console.log(this.productosVenta);   producto.cantidadDisponible
    this.deleteProduct(producto.referencia);
    this.productosVenta.push(producto);
    /* if ((producto.cantidadDisponible - producto.cantidad)<0) {
      this.cantidadCorrecta = false;
      console.log(this.cantidadCorrecta);
    } */
    this.productoVenta = {
      productoid: producto.referencia,
      precioUnitario: producto.precioVenta,
      cantidad: producto.cantidad,
      precioNeto: (producto.precioVenta * producto.cantidad)
    };
    //console.log(this.productoVenta);
    this.facturaCompleta.push(this.productoVenta);
    this.venta.neto = this.venta.neto + this.productoVenta.precioNeto;
    this.venta.itemVenta = this.facturaCompleta;
    
    /* this.prodActualizar = {
      referencia: producto.referencia,
      cantidadDisponible: producto.cantidadDisponible - producto.cantidad
    }

    this.productoService.update(this.prodActualizar).subscribe(data => {
      console.log(data);
    }) */
    //this.prodAlmacenService.update(this.prodActualizar);
    //console.log(this.prodActualizar);
  }

  deleteProduct(ref: any) {
    const productoEliminar = this.facturaCompleta.filter( producto => producto.productoid == ref );
    this.venta.neto = this.venta.neto - (productoEliminar.length > 0 ? productoEliminar[0].precioNeto : 0);
    this.facturaCompleta = this.facturaCompleta.filter(producto => producto.productoid != ref);
    this.venta.itemVenta = this.facturaCompleta;
    this.productosVenta = this.productosVenta.filter(producto => producto.referencia != ref);
    /* this.oldCantDisponible = productoEliminar.length > 0 ? productoEliminar[0].cantidad : 0;
    this.prodActualizar = {
      referencia: ref,
      cantidadDisponible: (cantDisponible + this.oldCantDisponible)
    };
    this.productoService.update(this.prodActualizar).subscribe(data => {
      console.log(data);
    }); */
    //console.log(this.oldCantDisponible);
  }

  saveSale() {
    this.cantidadCorrecta = true;
    
    this.productosVenta.forEach(producto => {
      if (producto.cantidadDisponible < producto.cantidad) {
        this.cantidadCorrecta = false;
      }
    })
    if (this.cantidadCorrecta) {
      console.log(this.cantidadCorrecta);
      let fecha = new Date();
      let dd = fecha.getDate();
      let mm = fecha.getMonth() + 1;
      let yyyy = fecha.getFullYear();
      this.venta.fecha = mm + '/' + dd + '/' + yyyy;
      this.guardando = true;
      this.saleService.create(this.venta).subscribe(data => {
        this.error = false;
        data.itemVenta.forEach(element => {
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
}
