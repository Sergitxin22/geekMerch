import { Foto } from './foto';
import { Variante } from './variante';

export interface Producto {
  ProductoId: number;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  PrecioAnterior: number;
  Oferta: boolean;
  Fotos: Foto[];
  Variantes: Variante[];
  ProductosCategorias: any[];
}
