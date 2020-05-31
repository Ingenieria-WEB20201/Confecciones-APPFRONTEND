import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BoardAdminComponent } from './components/board-admin/board-admin.component';
import { BoardModeratorComponent } from './components/board-moderator/board-moderator.component';
import { BoardUserComponent } from './components/board-user/board-user.component';

import { authInterceptorProviders } from './helpers/auth.interceptor';
import { ListaComponent } from './components/lista/lista.component';
import { SaleComponent } from './components/sale/sale.component';
import { CreateSaleComponent } from './components/create-sale/create-sale.component';
import { BoardCompraComponent } from './components/compra/board-compra/board-compra.component';
import { CreateCompraComponent } from './components/compra/create-compra/create-compra.component';
import { UpdateCompraComponent } from './components/compra/update-compra/update-compra.component';
import { ListEmpleadosComponent } from './components/list-empleados/list-empleados.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    ListaComponent,
    BoardCompraComponent,
    CreateCompraComponent,
    UpdateCompraComponent,
    ListEmpleadosComponent,
    SaleComponent,
    CreateSaleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
