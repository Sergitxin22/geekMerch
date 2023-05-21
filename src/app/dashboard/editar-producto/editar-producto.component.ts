import { Component, ChangeDetectorRef, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Foto } from 'src/app/interfaces/foto';
import { Producto } from 'src/app/interfaces/producto';
import { FotosProductosService } from 'src/app/services/fotos-productos.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
})
export class EditarProductoComponent implements OnInit {
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
  private productoId!: number;
  public producto!: Producto;
  public enOferta!: boolean;

  public primeraFoto?: Foto;
  public otrasFotos: Foto[] = [];
  public numFotos!: number;

  public formularioNuevoProducto!: FormGroup;
  public nuevoProducto!: Producto;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productosService: ProductosService,
    private fotosProductosService: FotosProductosService
  ) {
    this.formularioNuevoProducto = this.formBuilder.group({
      Nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
      Precio: new FormControl('', [Validators.required, Validators.min(0)]),
      PrecioAnterior: new FormControl(''),
      Descripcion: new FormControl(),
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
    });

    await this.getDetallesProducto();
  }

  @ViewChild('imgUpload') imgElement!: ElementRef;

  getDetallesProducto() {
    this.productosService.getProducto(this.productoId).subscribe({
      next: response => {
        this.producto = response;
        this.formularioNuevoProducto.patchValue(response);
        this.cargarVariables();
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

    this.hayFoto = true;

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

  async onSubmit() {
    if (this.formularioNuevoProducto.valid) {
      this.nuevoProducto = this.formularioNuevoProducto.value;

      this.nuevoProducto.Oferta =
        this.nuevoProducto.PrecioAnterior === 0 || this.nuevoProducto.PrecioAnterior === null ? false : true;

      await this.actualizarProducto(this.productoId, this.nuevoProducto);

      if (this.hayFoto) {
        await this.cargarFotos(this.productoId);
      }
    }
  }

  cargarFotos(productoId: number) {
    const cargarFoto = (numFoto: number, foto: File, modificada: boolean) => {
      if (foto && modificada) {
        const formData = new FormData();
        formData.append('Imagen', foto);

        if (this.producto.Fotos[numFoto - 1]) {
          const fotoId: number = this.producto.Fotos[numFoto - 1].Id;
          console.log('Actualizada: ', numFoto);

          this.fotosProductosService.actualizarFoto(productoId, fotoId, formData).subscribe({
            next: (response: any) => {
              console.log(response);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        } else {
          console.log('Subida: ', numFoto);
          this.fotosProductosService.subirFoto(productoId, formData).subscribe({
            next: (response: any) => {
              console.log(response);
            },
            error: (error: any) => {
              console.error(error);
            },
          });
        }
      }
    };

    cargarFoto(1, this.foto1, this.foto1Cargada);
    cargarFoto(2, this.foto2, this.foto2Cargada);
    cargarFoto(3, this.foto3, this.foto3Cargada);
    cargarFoto(4, this.foto4, this.foto4Cargada);

    // this.salir();
  }

  actualizarProducto(productoId: number, nuevoProducto: Producto) {
    console.log(nuevoProducto);

    this.productosService.putProducto(productoId, nuevoProducto).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  salir() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
