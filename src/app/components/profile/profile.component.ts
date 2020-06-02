import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form: any = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isAdmin = false;
  isUser = false;
  isTercero = false;
  private roles: string[];
  @Input() user: [];


  constructor(private authService: AuthService, private tokenStorageService: TokenStorageService) {
    console.log(this.user)
  }

  ngOnInit(): void {
  }
  async onSubmit(id) {
    const user = this.tokenStorageService.getUser();
    this.roles = user.roles;
    this.isAdmin = this.roles.includes('ROLE_ADMIN');
    this.isUser = this.roles.includes('ROLE_USER');
    this.isTercero = this.roles.includes('ROLE_TERCERO');
    if (this.isAdmin || this.isUser || this.isTercero) {
     await this.authService.updateUser(this.user, id).subscribe(
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
        title: 'Usuario actualizado satisfactoriamente',
        showConfirmButton: false,
        timer: 2500
      });

      await window.location.reload();

    } else {
      Swal.fire({
        icon: 'error',
        title: 'El usuario no se actualizo revise los campos o contactese con soporte',
        showConfirmButton: false,

      });
    }

  }

}



