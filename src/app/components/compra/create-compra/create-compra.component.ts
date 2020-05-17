import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { CompraService } from 'src/app/services/compra.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.css']
})
export class CreateCompraComponent implements OnInit {
  listaAlmacenes: any = [];
  productosCompra: any = [];
  productoCompra: any = {};
  productosNuevos: any = [];
  productoNuevo: any = {};
  productosAgrgadosCompleto: any = [];
  productoBuscado: any = {};
  compra: any = {
    neto: 0
  };
  activarCampos = false;
  activarOtrosCampos = false;
  productosNuevosGuardados = 0;
  cantidad = 0;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private productoService: ProductoService, 
    private compraService: CompraService, private almacenService: AlmacenService) { }

  ngOnInit(): void {
    this.compra.userid = this.tokenStorageService.getUser().id;
    this.almacenService.getAll().subscribe(data => {
      this.listaAlmacenes = data;
    });
  }

  buscarProducto(referencia: string) {
    this.cantidad = 0;
    this.productoBuscado = {};
    this.activarCampos = false;
    this.activarOtrosCampos = false;
    this.productoBuscado.referencia = referencia;
    this.productoService.get(referencia).subscribe(producto => {
      if (producto[0]) {
        this.productoBuscado = producto[0];
        this.activarOtrosCampos = true;
      } else {
        this.activarCampos = true;
        this.activarOtrosCampos = true;
      }
    });
  }

  agregarProducto() {
    this.productoBuscado.cantidadDisponible = this.cantidad;

    if (this.activarCampos) {
      this.productoNuevo = {
        referencia: this.productoBuscado.referencia,
        nombre: this.productoBuscado.nombre,
        marca: this.productoBuscado.marca,
        modelo: this.productoBuscado.modelo,
        estado: this.productoBuscado.estado,
        cantidadDisponible: this.productoBuscado.cantidadDisponible,
        precioVenta: this.productoBuscado.precioVenta,
      };
      this.productosNuevos.push(this.productoNuevo);
    }
    this.productosAgrgadosCompleto.push(this.productoBuscado);


    this.productoCompra = {
      productoid: this.productoBuscado.referencia,
      precioUnitario: this.productoBuscado.precioUnitario,
      cantidad: this.productoBuscado.cantidadDisponible,
      precioNeto: (this.productoBuscado.precioUnitario * this.productoBuscado.cantidadDisponible)
    };
    this.productosCompra.push(this.productoCompra);
    this.productoBuscado = {};

    this.compra.itemCompra = this.productosCompra;
    this.compra.neto = this.compra.neto + this.productoCompra.precioNeto;
    this.activarCampos = false;
    this.activarOtrosCampos = false;
    this.cantidad = 0;
  }

  eliminarProducto(item: any) {
    this.productosAgrgadosCompleto = this.productosAgrgadosCompleto.filter( producto => producto.referencia != item );    
    this.compra.neto = this.compra.neto - this.productosCompra.filter( producto => producto.productoid == item )[0].precioNeto;
    this.productosCompra = this.productosCompra.filter( producto => producto.productoid != item );
    this.productosNuevos = this.productosNuevos.filter( producto => producto.productoid != item );
  // productosNuevos: any = [];
  }

  guardarCompra() {
    let fecha = new Date();
    let dd = fecha.getDate();
    let mm = fecha.getMonth() + 1;
    let yyyy = fecha.getFullYear();
    this.compra.fecha = mm + '/' + dd + '/' + yyyy;

    if (this.productosNuevos.length > 0) {
      this.productosNuevos.forEach(producto => {
        this.productoService.create(producto).subscribe(data => {
          this.productosNuevosGuardados++;
          console.log(data);
          if (this.productosNuevosGuardados === this.productosNuevos.length) {
            this.compraService.create(this.compra).subscribe(data => {
              console.log(data);
              this.productosNuevosGuardados = 0;
              this.router.navigate(['/compra']);
            });
          }
        });
      });
    } else {
      this.compraService.create(this.compra).subscribe(data => {
        console.log(data);
        this.router.navigate(['/compra']);
      });
    }
  }

  limbiarCampos(){
    this.productoBuscado = {};
    this.cantidad = 0;
    this.activarCampos = false;
    this.activarOtrosCampos = false;
  }



}
