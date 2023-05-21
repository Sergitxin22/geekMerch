import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FotosProductosService {
  URL = 'https://localhost:44399/api/productos/foto';

  constructor(private http: HttpClient) {}

  subirFoto(productoId: number, data: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.http.post<any>(`${this.URL}/producto/${productoId}`, data);
  }

  actualizarFoto(productoId: number, fotoId: number, data: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    return this.http.put<any>(`${this.URL}/${productoId}/${fotoId}`, data);
  }

  getProductos(): Observable<any> {
    return this.http.get<any>(`https://localhost:44399/api/productos`);
  }
}
