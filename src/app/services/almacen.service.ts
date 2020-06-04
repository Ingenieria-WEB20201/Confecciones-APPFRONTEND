import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const ALMACEN_API = 'https://confeccionesapp-back.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http: HttpClient) { }

  create(almacen): Observable<any> {
    return this.http.post(ALMACEN_API + '/api/almac', {
      name: almacen.name,
      userid: almacen.userid
    });
  }

  getAll(): Observable<any> {
    return this.http.get(ALMACEN_API + '/api/almac');
  }

  get(id): Observable<any> {
    return this.http.get(ALMACEN_API + '/api/almac/' + id);
  }

  getByUser(id): Observable<any> {
    return this.http.get(ALMACEN_API + '/api/almacen/usuario/' + id);
  }
}
