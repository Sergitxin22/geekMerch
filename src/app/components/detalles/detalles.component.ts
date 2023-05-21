import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Foto } from 'src/app/interfaces/foto';
import { Producto } from 'src/app/interfaces/producto';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.css'],
})
export class DetallesComponent implements OnInit {
  private productoId!: number;
  public producto!: Producto;

  public primeraFoto?: Foto;
  public otrasFotos!: Foto[];
  public numFotos!: number;

  constructor(private route: ActivatedRoute, private productosService: ProductosService) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
    });

    await this.getDetallesProducto();
  }

  getDetallesProducto() {
    this.productosService.getProducto(this.productoId).subscribe({
      next: response => {
        this.producto = response;
        this.cargarVariables();
        console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  cargarVariables() {
    let fotos = [...this.producto.Fotos];
    this.numFotos = fotos ? fotos.length : 0;
    this.primeraFoto = fotos.shift();
    this.otrasFotos = fotos;
  }
}
