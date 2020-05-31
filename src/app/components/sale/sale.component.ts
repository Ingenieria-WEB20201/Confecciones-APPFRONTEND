import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SaleService } from '../../services/sale.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  content: string;
  elementos: any = [];
  listaAlmacenes: any = [];

  constructor(private userService: UserService, private saleService: SaleService, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService) { }

  ngOnInit(): void {
    this.content = this.tokenStorageService.getUser().id;

    this.almacenService.getByUser(this.content).subscribe(data => {
      this.listaAlmacenes = data;
    });

    for (let almacen of this.listaAlmacenes) {
      console.log('i'); // 1, "string", false
    }
    this.saleService.getByAlmacenId('1').subscribe(data => {
      this.elementos = data;
    })
  }

  eventoDeTabla(cod: String){
    console.log(cod);
  }
}
