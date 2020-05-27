import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  content: string;
  elementos: any = [];

  constructor(private userService: UserService, private saleService: SaleService) {
      /* this.elementos = [
        {
          id: 1,
          neto: 50,
          fecha: "2020/04/27",
          userid: 1,
          almacenid:3,
          itemCompra: [{
            productoid: 1234,
            precioUnitario: 50,
            cantidad: 20,
            precioNeto: 526
          },
          {
            productoid: 1544,
            precioUnitario: 560,
            cantidad: 220,
            precioNeto: 526
          }
          ]
        },
        {
          id: 2,
          neto: 540,
          fecha: "2020/04/27",
          userid: 15,
          itemCompra: [{
            productoid: 125434,
            precioUnitario: 50,
            cantidad: 20,
            precioNeto: 526
          },
          {
            productoid: 1656544,
            precioUnitario: 560,
            cantidad: 220,
            precioNeto: 526
          }
          ]
        }
      ]; */
   }

  ngOnInit(): void {
    this.saleService.getByAlmacenId('1').subscribe(data => {
      this.elementos = data;
      console.log(data);
    })
  }

  eventoDeTabla(cod: String){
    console.log(cod);
  }
}
