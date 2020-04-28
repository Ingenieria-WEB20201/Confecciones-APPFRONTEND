import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-compra',
  templateUrl: './create-compra.component.html',
  styleUrls: ['./create-compra.component.css']
})
export class CreateCompraComponent implements OnInit {

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

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private productoService: ProductoService) { }

  ngOnInit(): void {
    this.compra.userid = this.tokenStorageService.getUser().id;
  }

  save(form: NgForm) {

  }

  buscarProducto(referencia: string) {
    this.productoService.get(referencia).subscribe(producto => {
      //this.productoBuscado = producto[0];
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
    if (this.activarCampos) {
      this.productoNuevo = {
        referencia : this.productoBuscado.referencia,
        nombre : this.productoBuscado.nombre,
        marca : this.productoBuscado.marca,
        modelo : this.productoBuscado.modelo,
        estado : this.productoBuscado.estado,
        cantidadDisponible : this.productoBuscado.cantidadDisponible,
        precioVenta : this.productoBuscado.precioVenta,
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
    
  }

  guardarCompra(){
    console.log(this.compra);
  }

}
