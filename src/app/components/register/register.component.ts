import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

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

  onSubmit() {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    this.isAdmin = this.roles.includes('ROLE_ADMIN');

    console.log(this.form);
    if (this.isAdmin) {
     /* this.authService.register(this.form).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        }
      );*/
      Swal.fire({
        icon: 'success',
        title: 'Usuario Registrado satisfactoriamente',
        showConfirmButton: false,
        timer: 2500
      });
      setTimeout(()=>{
        window.location.reload();
   }, 2500);


    } else {
      Swal.fire({
        icon: 'error',
        title: 'El usuario no se registro revise los campos o contactese con soporte',
        showConfirmButton: false,

      });
    }

  }




}
