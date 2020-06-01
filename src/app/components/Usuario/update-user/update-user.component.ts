import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  form: any = [];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isAdmin = false;
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
    if (this.isAdmin) {
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


