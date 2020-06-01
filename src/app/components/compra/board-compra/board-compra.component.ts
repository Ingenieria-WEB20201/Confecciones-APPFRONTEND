import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CompraService } from 'src/app/services/compra.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-board-compra',
  templateUrl: './board-compra.component.html',
  styleUrls: ['./board-compra.component.css']
})
export class BoardCompraComponent implements OnInit {
  elementos: any = [];
  busqueda: any = {
    tipo: 'codigo',
    busqueda: '',
    fecha: ''
  };
  error = false;

  constructor(private router: Router, private productoService: ProductoService, private compraService: CompraService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.buscarTodos();
  }

  buscarTodos() {
    this.busqueda = {
      tipo: 'codigo',
      busqueda: '',
      fecha: ''
    };
    this.compraService.getAll().subscribe(data => {
      this.elementos = data;
      this.error = false;
    }, err => {
      this.error = true;
    });
  }

  cambioDeBusqueda() {
    this.busqueda.busqueda = '';
    this.busqueda.fecha = '';
  }

  modificarCompra(id: String) {
    this.router.navigate(['compra/modificar', id]);
  }

  buscar() {
    switch (this.busqueda.tipo) {
      case 'codigo':
        this.busquedaPorCodigo();
        break;
      case 'producto':
        this.busquedaPorProducto();
        break;
      case 'usuario':
        this.busquedaPorUsuario();
        break;
      case 'fechas':
        this.busquedaPorFechas();
        break;
    }
  }

  busquedaPorCodigo() {
    this.compraService.get(this.busqueda.busqueda).subscribe(data => {
      this.error = false;
      this.elementos = data;

      // this.error = false;
      // this.elementos = [data];
    }, err => {
      // this.elementos = [];
      this.error = true;
    });
  }

  busquedaPorProducto() {
    this.compraService.findByProducto('U' + this.busqueda.busqueda).subscribe(dataUsados => {
      this.error = false;
      this.compraService.findByProducto('N' + this.busqueda.busqueda).subscribe(dataNuevos => {
        this.error = false;
        this.elementos = dataUsados;
        if (this.elementos.length > 0) {
          dataUsados.forEach(productoUsado => {
            this.elementos = this.elementos.concat(dataNuevos.filter(productoNuevo => productoUsado.id != productoNuevo.id));
          });
        } else {
          this.elementos = dataNuevos;
        }

      }, err => {
        this.error = true;
      });
    }, err => {
      this.error = true;
    });
  }

  busquedaPorUsuario() {
    this.compraService.findByUser(this.busqueda.busqueda).subscribe(data => {
      this.error = false;
      this.elementos = data;
    }, err => {
      this.error = true;
    });
  }

  busquedaPorFechas() {
    let fechas = {
      startDate: `${this.busqueda.fecha[0].getFullYear()}/${this.busqueda.fecha[0].getMonth() + 1}/${this.busqueda.fecha[0].getDate()}`,
      endDate: `${this.busqueda.fecha[1].getFullYear()}/${this.busqueda.fecha[1].getMonth() + 1}/${this.busqueda.fecha[1].getDate()}`
    };
    this.compraService.findByFecha(fechas).subscribe(data => {
      this.error = false;
      this.elementos = data;
    }, err => {
      this.error = true;
    });
  }

  eliminarCompra(id: string) {
    this.compraService.delete(id).subscribe(data => {
      this.error = false;
      this.elementos = this.elementos.filter(compra => compra.id != id);
    }, err => {
      this.error = true;
    });
  }



}
