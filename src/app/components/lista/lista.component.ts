import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @Input() items: any[] = [];
  @Output() modificar = new EventEmitter<String>();
  @Output() eliminar = new EventEmitter<String>();
  detalle: any;
  idEliminar: any;
  error = false;

  constructor(private productoService: ProductoService) {
    this.modificar = new EventEmitter();
    this.eliminar = new EventEmitter();
  }

  ngOnInit(): void {
  }
  
  verDetalles(item: string) {
    this.detalle = item;
    if (this.detalle.hasOwnProperty('itemVenta')) {
      this.detalle.items = this.detalle.itemVenta;
    } else {
      this.detalle.items = this.detalle.itemCompra;
    }

    this.detalle.items.forEach(element => {
      // Busqueda de nombre de cada producto
      this.productoService.get(element.productoid).subscribe(data => {
        this.error = false;
        element.nombre = data[0].nombre;
      }, err => {
        this.error = true;
      });
    });
  }

  modificarFactura(cod: String) {
    this.modificar.emit(cod);
  }

  registratIdEliminar(cod: string) {
    this.idEliminar = cod;
  }

  eliminarFactura() {
    this.eliminar.emit(this.idEliminar);
  }

}
