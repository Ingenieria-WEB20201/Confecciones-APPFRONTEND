import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PRODUCTO_API = 'https://confeccionesapp-back.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  create(producto): Observable<any> {
    return this.http.post(PRODUCTO_API + '/api/producto', {
      referencia: producto.referencia,
      nombre: producto.nombre,
      marca: producto.marca,
      modelo: producto.modelo,
      estado: producto.estado,
      cantidadDisponible: producto.cantidadDisponible,
      precioVenta: producto.precioVenta
    });
  }

  getAll(): Observable<any> {
    return this.http.get(PRODUCTO_API + '/api/productos');
  }

  get(referencia): Observable<any> {
    return this.http.get(PRODUCTO_API + '/api/producto/' + referencia);
  }

  update(producto): Observable<any> {
    return this.http.put(PRODUCTO_API + '/api/producto', {
      referencia: producto.referencia,
	    cantidadDisponible: producto.cantidadDisponible
    });
  }

  codificarReferencia(referencia: string, estado: string): string{
    return estado.charAt(0).concat(referencia);
  }

  decodificarReferencia(referencia: string) {
    return {
      referencia: referencia.slice(1),
      estado: referencia.charAt(0) === 'n' ? 'nuevo' : 'usado'
    };
  }

}
