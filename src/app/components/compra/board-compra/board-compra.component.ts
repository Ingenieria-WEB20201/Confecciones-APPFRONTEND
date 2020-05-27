import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { CompraService } from 'src/app/services/compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board-compra',
  templateUrl: './board-compra.component.html',
  styleUrls: ['./board-compra.component.css']
})
export class BoardCompraComponent implements OnInit {

  elementos: any = [];

  constructor(private router: Router, private productoService: ProductoService,private compraService: CompraService) { }

  ngOnInit(): void {
    this.compraService.getAll().subscribe(data => {
      this.elementos = data;
      console.log(data);
    });
  }

  modificarCompra(id: String){
    
  }

}
