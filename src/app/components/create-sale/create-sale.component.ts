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
  listaAlmacenes: any = [];
  productosVenta: any = [];
  productoVenta: any = {};
  facturaCompleta: any = [];
  venta: any = {
    neto: 0
  };  

  items: any[] = [];
  detalle: any;
  elementos = [];

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService,
    private productoService: ProductoService, private prodAlmacenService: ProductoAlmacenService, private saleService: SaleService) { }

  ngOnInit(): void {
    this.venta.userid = this.tokenStorageService.getUser().id;
    //this.almacenService.getAll().subscribe(data => {
    this.almacenService.get(this.venta.userid).subscribe(data => {
      this.listaAlmacenes = data;
      console.log(data);
    });

    this.prodAlmacenService.get('1').subscribe(data => {
      this.items = data;
    });
  }

  onSubmit(f: NgForm) {
    console.log(f.value);
  }

  saveProduct(producto, f:NgForm) {
    console.log(f.value.first);
    producto.cantidad = f.value.first;
    console.log(this.productosVenta);
    this.productosVenta.push(producto);
    this.productoVenta = {
      productoid: producto.referencia,
      precioUnitario: producto.precioVenta,
      cantidad: producto.cantidad,
      precioNeto: (producto.precioVenta)
    };
    console.log(this.productoVenta);
    this.facturaCompleta.push(this.productoVenta);
    this.venta.neto = this.venta.neto + this.productoVenta.precioNeto;
    this.venta.itemVenta = this.facturaCompleta;
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
  deleteProduct(ref: any) {
    this.productosAgrgadosCompleto = this.productosAgrgadosCompleto.filter( producto => producto.referencia != item );    
    this.venta.neto = this.venta.neto - this.productosVenta.filter( producto => producto.productoid == ref )[0].precioNeto;
    this.productosCompra = this.productosCompra.filter( producto => producto.productoid != item );
  }
   
  gotoList() {
    this.router.navigate(['/create-sale']);
  }

  save(form: NgForm) {
    this.productoService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
  
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
