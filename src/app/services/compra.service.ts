import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const COMPRA_API = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  constructor(private http: HttpClient) { }

  create(compra): Observable<any> {
    console.log(compra);
    return this.http.post(COMPRA_API + '/api/compra/', {
      neto: compra.neto,
      fecha: compra.fecha,
      userid: compra.userid,
      almacenid: compra.almacenid,
      itemCompra: compra.itemCompra
    });
  }

  getAll(): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/');
  }

  get(id: string): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/id/' + id);
  }

  findByFecha(fechas): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/fecha?startDate=' + fechas.startDate + '&endDate=' + fechas.endDate);
  }

  findByUser(id: string): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/user/' + id);
  }

  findByProducto(producto: string): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/producto/' + producto);
  }

  delete(id: string) {
    return this.http.delete(COMPRA_API + '/api/compra/id/' + id);
  }

  deleteItem(item): Observable<any> {
    console.log(item);
    return this.http.request('delete', COMPRA_API + '/api/compra/item/', {
      body: {
        compraid: item.compraid,
        productoid: item.productoid
      }
    });
  }

  update(compra): Observable<any> {
    console.log(compra);
    return this.http.put(COMPRA_API + '/api/compra/', {
      id: compra.id,
      neto: compra.neto,
      fecha: compra.fecha,
      userid: compra.userid,
      itemCompra: compra.itemCompra
    });
  }
}
