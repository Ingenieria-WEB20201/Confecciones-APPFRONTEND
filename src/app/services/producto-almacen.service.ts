import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PRODALMACEN_API = 'https://confeccionesapp-back.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class ProductoAlmacenService {

  constructor(private http: HttpClient) { }

  create(producto): Observable<any> {
    return this.http.post(PRODALMACEN_API + '/api/almacen', {
      cantidad: producto.cantidad,
      productoId: producto.productoId,
      almacenId: producto.almacenId
    });
  }

  get(almacen): Observable<any> {
    return this.http.get(PRODALMACEN_API + '/api/almacen/' + almacen);
  }

  update(producto): Observable<any> {
    return this.http.put(PRODALMACEN_API + '/api/almacen', {
      productoid : producto.id,
	    almacenid : producto.almacenid,
	    cantidad : producto.cantDisponible
    });
  }
}
