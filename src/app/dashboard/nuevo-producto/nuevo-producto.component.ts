import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FotosProductosService } from 'src/app/services/fotos-productos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css'],
})
export class NuevoProductoComponent implements OnInit {
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

  constructor(
    private router: Router,
    private fotosProductosService: FotosProductosService,
    private productosService: ProductosService
  ) {}

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

      if (this.producto.PrecioAnterior === '' || this.producto.PrecioAnterior === null) {
        this.producto.Oferta = false;
        this.producto.PrecioAnterior = 0;
      } else {
        this.producto.Oferta = true;
      }

      if (this.hayFoto) {
        this.productosService.postProducto(this.producto).subscribe({
          next: (response: any) => {
            console.log(response);
            this.cargarFotos(response.ProductoId);
            this.router.navigate(['/dashboard/productos']);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      }
    }
  }

  cargarFotos(productoId: number) {
    const cargarFoto = (foto: File) => {
      if (foto) {
        const formData = new FormData();
        formData.append('Imagen', foto);

        this.fotosProductosService.subirFoto(productoId, formData).subscribe({
          next: (response: any) => {
            console.log(response);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      }
    };

    cargarFoto(this.foto1);
    cargarFoto(this.foto2);
    cargarFoto(this.foto3);
    cargarFoto(this.foto4);
  }
}
