import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FotosProductosService } from 'src/app/services/fotos-productos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public Editor = ClassicEditor;

  public foto1Cargada!: boolean;
  public foto2Cargada!: boolean;
  public foto3Cargada!: boolean;
  public foto4Cargada!: boolean;

  public foto1!: File;
  public foto2!: File;
  public foto3!: File;
  public foto4!: File;

  public hayFoto: boolean = true;

  public fotoPredeterminada: string = 'https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
  public producto!: any;
  public enOferta!: boolean;

  formularioNuevoProducto = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    Precio: new FormControl('', [Validators.required, Validators.min(0)]),
    PrecioAnterior: new FormControl(''),
    Descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
  });

  constructor(private fotosProductosService: FotosProductosService, private productosService: ProductosService) {}

  ngOnInit(): void {
    this.enOferta == false;
    this.fotosProductosService.getProductos().subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  @ViewChild('imgUpload') imgElement!: ElementRef;

  public onChange({ editor }: ChangeEvent) {
    const data = editor.data.get();

    console.log(data);
  }

  public handleFileSelect(event: any, idImagen: number) {
    let input = event.target;
    let file = input.files[0];

    if (!file) {
      console.error('No se seleccionó ningún archivo.');
      return;
    }

    if (idImagen === 1) {
      this.foto1Cargada = true;
      this.foto1 = file;
      if (this.hayFoto === false) this.hayFoto = true;
    }

    if (idImagen === 2) {
      this.foto2Cargada = true;
      this.foto2 = file;
    }

    if (idImagen === 3) {
      this.foto3Cargada = true;
      this.foto3 = file;
    }

    if (idImagen === 4) {
      this.foto4Cargada = true;
      this.foto4 = file;
    }
    console.log(this.foto1);

    let reader = new FileReader();

    reader.onload = function (event) {
      let imgElement = input.parentNode.querySelector('.imgUpload');

      if (imgElement) {
        imgElement.src = event?.target?.result;
      }
    };

    reader.readAsDataURL(file);
  }

  downloadImage() {
    if (this.imgElement) {
      const link = document.createElement('a');
      link.href = this.imgElement.nativeElement.src;
      link.download = 'image.png';
      link.click();
    }
  }

  toggleEnOferta() {
    this.enOferta = !this.enOferta;
  }

  limpiarFormulario() {
    this.formularioNuevoProducto.reset();
  }

  onSubmit() {
    if (this.formularioNuevoProducto.valid) {
      if (!this.foto1Cargada) {
        this.hayFoto = false;
      }
      this.producto = this.formularioNuevoProducto.value;
      this.producto.PrecioAnterior === '' || this.producto.PrecioAnterior === null
        ? (this.producto.Oferta = false)
        : (this.producto.Oferta = true);

      if (this.hayFoto) {
        this.productosService.postProducto(this.producto).subscribe({
          next: (response: any) => {
            console.log(response);
            this.cargarFotos(response.ProductoId);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      }
    }
    console.log(this.formularioNuevoProducto.value);
    console.log(this.formularioNuevoProducto.valid);
  }

  cargarFotos(productoId: number) {
    if (this.foto1Cargada) {
      const formData = new FormData();
      formData.append('Imagen', this.foto1);

      this.fotosProductosService.subirFoto(productoId, formData).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
    if (this.foto2Cargada) console.log(this.foto2);
    if (this.foto3Cargada) console.log(this.foto3);
    if (this.foto4Cargada) console.log(this.foto4);
  }
}
