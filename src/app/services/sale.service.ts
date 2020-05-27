import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const SALE_API = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  create(sale): Observable<any> {
    console.log(sale);
    return this.http.post(SALE_API + '/api/venta/', {
      neto: sale.neto,
      fecha: sale.fecha,
      userid: sale.userid,
      almacenid: sale.almacenid,
      itemVenta: sale.itemVenta
    });
  }

  /* getAll(): Observable<any> {
    return this.http.get(COMPRA_API + '/api/compra/');
  } */

  getByAlmacenId(id: String): Observable<any> {
    return this.http.get(SALE_API + '/api/venta/almacen/' + id);
  }
}
