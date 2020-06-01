import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import * as jQuery from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'confecciones-appfrontend';
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  idUser: string;
  avatar: string;
  UsuarioId = [];
  constructor(private tokenStorageService: TokenStorageService, private authService: AuthService) { }

  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_TERCERO');

      this.username = user.username;
      this.idUser = user.id;
      this.avatar = user.avatar;

    }

    var contenerdor = document.getElementById("container-login");
    var oculto = document.getElementById("menu-toggle");

    if (this.isLoggedIn == false) {
      contenerdor.style.backgroundImage = 'url("../assets/fondo.jpg")';
      contenerdor.style.backgroundSize = "cover";
      contenerdor.style.backgroundRepeat = "no-repeat";
      contenerdor.style.height = "100%";
      oculto.style.display = "none"
    } else {
      contenerdor.style.backgroundColor = "#fff"
    }

      jQuery("#menu-toggle").click(function (e) {
        e.preventDefault();
        jQuery("#wrapper").toggleClass("toggled");
      });

  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }


  editUser(id){
    this.UsuarioId = [];
    this.authService.getUserByid(id).subscribe(data => {
    this.UsuarioId.push(data);
    })
  }


}
