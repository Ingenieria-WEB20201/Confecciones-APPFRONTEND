import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const AUTH_API = 'http://localhost:3000';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + '/api/auth/signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    console.log(user);
    return this.http.post(AUTH_API + '/api/auth/signup', {
      username: user.username,
      name: user.name,
      email: user.email,
      password: user.password,
      enable: user.enable,
      avatar: user.avatar
    }, httpOptions);
  }

  getAllUsers(): Observable <any> {
    return this.http.get(AUTH_API + "/api/auth/users")
}

}
