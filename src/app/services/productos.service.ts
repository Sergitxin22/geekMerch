import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';
import { Variante } from '../interfaces/variante';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  URL = 'https://localhost:44399/api/productos';

  constructor(private http: HttpClient) {}

  getProducto(productoId: number): Observable<any> {
    return this.http.get<Producto>(`${this.URL}/${productoId}`);
  }

  getProductos(): Observable<any> {
    return this.http.get<any>(this.URL);
  }

  postProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.URL, producto);
  }

  deleteProducto(productoId: any): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${productoId}`);
  }

  putProducto(productoId: number, nuevoProducto: Producto): Observable<any> {
    return this.http.put<any>(`${this.URL}/${productoId}`, nuevoProducto);
  }

  getVariantesProducto(productoId: number): Observable<any> {
    return this.http.get<Producto>(`${this.URL}/variantes/${productoId}`);
  }
  getVarianteProductoById(productoId: number, varianteId: number): Observable<any> {
    return this.http.get<Producto>(`${this.URL}/${productoId}/variantes/${varianteId}`);
  }

  postVariantesProducto(variante: any, productoId: number): Observable<any> {
    return this.http.post<Producto>(`${this.URL}/${productoId}/variantes`, variante);
  }

  putVarianteProducto(productoId: number, varianteId: number, variante: any): Observable<any> {
    return this.http.put<any>(`${this.URL}/${productoId}/variantes/${varianteId}`, variante);
  }

  deleteVariantesProducto(varianteId: number, productoId: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${productoId}/variantes/${varianteId}`);
  }
}
