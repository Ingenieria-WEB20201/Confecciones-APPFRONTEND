import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isAdmin = false;
  private roles: string[];

  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }

 async onSubmit() {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    this.isAdmin = this.roles.includes('ROLE_ADMIN');

    console.log(this.form);
    if (this.isAdmin) {
     await this.authService.register(this.form).subscribe(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );
     await Swal.fire({
        icon: 'success',
        title: 'Usuario Registrado satisfactoriamente',
        showConfirmButton: false,
        timer: 2500
      });

      await window.location.reload();
  //

    } else {
      Swal.fire({
        icon: 'error',
        title: 'El usuario no se registro revise los campos o contactese con soporte',
        showConfirmButton: false,

      });
    }

  }




}
