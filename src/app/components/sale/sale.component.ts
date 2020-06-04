import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  content: any;
  elementos: any = [];
  listaAlmacenes: any = [];
  error = false;
  almacenid: any;
  buscar: any;
  listar = false;

  constructor(private router: Router, private userService: UserService, private saleService: SaleService, private tokenStorageService: TokenStorageService, private almacenService: AlmacenService) { }

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.elementos = [];
    this.buscar = '';
    this.almacenid = null;
    this.listar = false;
    this.content = this.tokenStorageService.getUser().id;

    this.almacenService.getByUser(this.content).subscribe(data => {
      this.error = false;
      this.listaAlmacenes = data;
    }, err => {
      this.error = true;
    });
  }

  listarVenta() {
    this.listar = true;
    this.elementos = [];
    this.saleService.getByAlmacenId(this.almacenid).subscribe(data => {
      this.error = false;
      data.forEach(element => {
        this.elementos.push(element);
      });
    }, err => {
      this.error = true;
    })
  }

  modificarVenta(id: String) {
    this.router.navigate(['update-sale', id]);
  }

  findById() {
    this.elementos = [];
    this.saleService.getById(this.buscar).subscribe(data => {
      this.elementos.push(data);
    });

  }
}
