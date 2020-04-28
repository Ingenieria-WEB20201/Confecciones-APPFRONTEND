import { Component, OnInit, Input } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {

  items: any[] = [];
  detalle: any;
  content: string;
  elementos = [];

  constructor(private productoService: ProductoService) {
      this.items = [
        {
            referencia: "10",
            nombre: "auto",
            marca: "marca",
            modelo: "modelo",
            estado: "estado",
            cantidadDisponible: 5,
            precioVenta: 28000000,
            createdAt: "2020-04-27T04:17:11.000Z",
            updatedAt: "2020-04-27T04:17:11.000Z"
        },
        {
            referencia: "1",
            nombre: "maquina1",
            marca: "marca",
            modelo: "modelo",
            estado: "estado",
            cantidadDisponible: 4,
            precioVenta: 30000,
            createdAt: "2020-04-25T23:07:31.000Z",
            updatedAt: "2020-04-27T05:45:51.000Z"
        }
    ]
    
   }

  ngOnInit(): void {
  }

  /* 
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
