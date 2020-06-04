import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoAlmacenService } from 'src/app/services/producto-almacen.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  busqueda: any = {
    tipo: 'codigo',
    busqueda: ''
  };
  productos = [];
  error = false;

  constructor(private router: Router, private tokenStorageService: TokenStorageService, private productoService: ProductoService, 
              private productoAlmacenService: ProductoAlmacenService) {
  }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.buscarTodos();

  }

  buscarTodos() {
    this.productoService.getAll().subscribe(data => {
      this.error = false;
      this.productos = data;
    }, err => {
      this.error = true;
    });
  }

  buscar() {
    switch (this.busqueda.tipo) {
      case 'codigo':
        this.busquedaPorCodigo();
        break;
      case 'almacen':
        this.busquedaPorAlmacen();
        break;
    }
  }

  busquedaPorCodigo() {
    this.productoService.get('N' + this.busqueda.busqueda).subscribe(productoNuevo => {
      this.error = false;
      this.productos = productoNuevo;
      this.productoService.get('U' + this.busqueda.busqueda).subscribe(productoUsado => {
        this.productos = this.productos.concat(productoUsado);
      });
    }, err => {
      this.error = true;
    });
  }

  busquedaPorAlmacen() {
    this.productoAlmacenService.get(this.busqueda.busqueda).subscribe(productosAlmacen  => {
      this.productos = [];
      productosAlmacen.forEach(prod => {
        this.productos.push(prod[0]);
      });
    });
  }

}
