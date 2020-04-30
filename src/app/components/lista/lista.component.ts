import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service'

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @Input() items: any[] = [];
  @Output() modificar = new EventEmitter<String>();
  detalle: any;

  constructor(private productoService: ProductoService) {
    this.modificar = new EventEmitter();
  }

  ngOnInit(): void {
  }

  verDetalles(item: String) {
    this.detalle = item;
    // this.detalle.nombreUser = 'Nombre user';
    if (this.detalle.hasOwnProperty('itemVenta')) {
      this.detalle.items = this.detalle.itemVenta;
    } else {
      this.detalle.items = this.detalle.itemCompra;
    }

    this.detalle.items.forEach(element => {
      //Busqueda de nombre de cada producto
      this.productoService.get(element.productoid).subscribe(data => {
        element.nombre = data[0].nombre;
        console.log(data);
      });
      // element.nombre = 'nompre producto';
    });
  }

  modificarFactura( cod: String ){
    this.modificar.emit(cod);
  }

}
