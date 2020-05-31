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

  aux: any;
  constructor(private router: Router, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService,
    private productoService: ProductoService, private prodAlmacenService: ProductoAlmacenService, private saleService: SaleService) { }

  ngOnInit(): void {
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
    console.log(f.value.first);
    producto.cantidad = f.value.first + this.oldCant;
    console.log(this.productosVenta);
    this.deleteProduct(producto.referencia);
    this.productosVenta.push(producto);
    this.productoVenta = {
      productoid: producto.referencia,
      precioUnitario: producto.precioVenta,
      cantidad: producto.cantidad,
      precioNeto: (producto.precioVenta * producto.cantidad)
    };
    console.log(this.productoVenta);
    this.facturaCompleta.push(this.productoVenta);
    this.venta.neto = this.venta.neto + this.productoVenta.precioNeto;
    this.venta.itemVenta = this.facturaCompleta;
  }

  deleteProduct(ref: any) {
    //this.aux = this.facturaCompleta.filter(producto => producto.productoid == ref);
    const productoEliminar = this.facturaCompleta.filter( producto => producto.productoid == ref );
    //this.compra.neto = this.compra.neto - (productoEliminar.length > 0 ? productoCompraEliminar[0].precioNeto : 0);
    this.venta.neto = this.venta.neto - (productoEliminar.length > 0 ? productoEliminar[0].precioNeto : 0);
    this.facturaCompleta = this.facturaCompleta.filter( producto => producto.productoid != ref );
    this.productosVenta = this.productosVenta.filter(producto => producto.referencia != ref);
    //console.log(this.aux[0].precioNeto);
    //console.log(this.productosVenta);
    //console.log(this.facturaCompleta);
  }

  saveSale() {
    let fecha = new Date();
    let dd = fecha.getDate();
    let mm = fecha.getMonth() + 1;
    let yyyy = fecha.getFullYear();
    this.venta.fecha = mm + '/' + dd + '/' + yyyy;
    
    if (this.productosVenta.length > 0) {
      this.productosVenta.forEach(producto => {
        this.saleService.create(this.venta).subscribe(data => {
          console.log(data);
          this.router.navigate(['/sale']);
        });
      });
    } else {
        console.log('data');
        this.router.navigate(['/compra']);
    }
  }


/*
  
   

  verDetalles(item: String) {
    this.detalle = item;
    this.detalle.nombreUser = 'Nombre user';
    if (this.detalle.hasOwnProperty('itemVenta')) {
      this.detalle.items = this.detalle.itemVenta;
    } else {
      this.detalle.items = this.detalle.itemCompra;
    }

    this.detalle.items.forEach(element => {
      //Busqueda de nombre de cada producto
      element.nombre = 'nompre producto';
    });
  } */
}
