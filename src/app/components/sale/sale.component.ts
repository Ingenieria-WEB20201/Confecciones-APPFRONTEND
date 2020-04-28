import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  content: string;
  elementos = [];

  constructor(private userService: UserService) {
      this.elementos = [
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
      ];
   }

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

  eventoDeTabla(cod: String){
    console.log(cod);
  }
}
