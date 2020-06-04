import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.component.html',
  styleUrls: ['./list-empleados.component.css']
})
export class ListEmpleadosComponent implements OnInit {

  Empleados = [];
  UsuarioId = [];
  UsuarioFiltrado = '';

  idUser;

  constructor(private authservice: AuthService) {
    this.authservice.getAllUsers().subscribe(data => {
      this.Empleados = data;
    })

    console.log(this.UsuarioFiltrado)
  }

  ngOnInit(): void {
  }


  async deleteUser(id) {
    this.authservice.deleteUser(id).subscribe(
      result => { },
      error => console.error(error)
    );
    await Swal.fire({
      icon: 'success',
      title: 'Usuario Registrado satisfactoriamente',
      showConfirmButton: false,
      timer: 2500
    });
    await window.location.reload();

  }

  editUser(id) {
    this.UsuarioId = [];
    this.authservice.getUserByid(id).subscribe(data => {
      this.UsuarioId.push(data);
    })
  }

}
