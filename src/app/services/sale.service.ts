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
    return this.http.post(SALE_API + '/api/venta/', {
      neto: sale.neto,
      fecha: sale.fecha,
      userid: sale.userid,
      almacenid: sale.almacenid,
      itemVenta: sale.itemVenta
    });
  }

  getByAlmacenId(id: any): Observable<any> {
    return this.http.get(SALE_API + '/api/venta/almacen/' + id);
  }

  getById(id: String): Observable<any> {
    return this.http.get(SALE_API + '/api/venta/' + id);
  }

  update(sale): Observable<any> {
    return this.http.put(SALE_API + '/api/venta/', {
      ventaid: sale.id,
      neto: sale.neto,
      almacenid: sale.almacenid,
      itemVenta: sale.itemVenta
    })
  }
}