import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  URL = 'https://localhost:44399/api/categorias';

  constructor(private http: HttpClient) {}

  getCategoria(categoriaId: number): Observable<any> {
    return this.http.get<Categoria>(`${this.URL}/${categoriaId}`);
  }

  getCategorias(): Observable<any> {
    return this.http.get<Categoria>(this.URL);
  }

  postCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(this.URL, categoria);
  }

  putCategoria(categoriaId: number, categoria: any): Observable<any> {
    return this.http.put<any>(`${this.URL}/${categoriaId}`, categoria);
  }

  deleteCategoria(categoriaId: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${categoriaId}`);
  }

  getCategoriasProducto(productoId: number): Observable<any> {
    return this.http.get<Categoria>(`${this.URL}/producto/${productoId}`);
  }

  postCategoriasProducto(categoriaId: number, productoId: number): Observable<any> {
    return this.http.post<any>(`${this.URL}/${categoriaId}/productos/${productoId}`, null);
  }

  deleteCategoriasProducto(categoriaId: number, productoId: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${categoriaId}/productos/${productoId}`);
  }

  getCategoriasProductos(): Observable<any> {
    return this.http.get<Categoria>(`${this.URL}/productos`);
  }

  // putProducto(productoId: number, nuevoProducto: Producto): Observable<any> {
  //   return this.http.put<any>(`${this.URL}/${productoId}`, nuevoProducto);
  // }

  // getVariantesProducto(productoId: number): Observable<any> {
  //   return this.http.get<Producto>(`${this.URL}/variantes/${productoId}`);
  // }
  // getVarianteProductoById(productoId: number, varianteId: number): Observable<any> {
  //   return this.http.get<Producto>(`${this.URL}/${productoId}/variantes/${varianteId}`);
  // }

  // postVariantesProducto(variante: any, productoId: number): Observable<any> {
  //   return this.http.post<Producto>(`${this.URL}/${productoId}/variantes`, variante);
  // }

  // putVarianteProducto(productoId: number, varianteId: number, variante: any): Observable<any> {
  //   return this.http.put<any>(`${this.URL}/${productoId}/variantes/${varianteId}`, variante);
  // }

  // deleteVariantesProducto(varianteId: number, productoId: number): Observable<any> {
  //   return this.http.delete<any>(`${this.URL}/${productoId}/variantes/${varianteId}`);
  // }
}
