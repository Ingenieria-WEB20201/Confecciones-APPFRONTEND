import { Component, OnInit } from '@angular/core';
import {AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  Empleados = [];
  UsuarioId = [];
  idUser;

  constructor(private authservice: AuthService) {
    this.authservice.getAllUsers().subscribe(data => {
      this.Empleados = data;
    })
   }

  ngOnInit(): void {
  }

  editUser(id){
    this.UsuarioId = [];
    this.authservice.getUserByid(id).subscribe(data => {
    this.UsuarioId.push(data);
    })
  }

}
