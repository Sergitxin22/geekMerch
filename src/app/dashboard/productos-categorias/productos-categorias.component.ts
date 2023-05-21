import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from '../../interfaces/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { Variante } from 'src/app/interfaces/variante';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Categoria } from 'src/app/interfaces/categoria';

@Component({
  selector: 'app-productos-categorias',
  templateUrl: './productos-categorias.component.html',
  styleUrls: ['./productos-categorias.component.css'],
})
export class ProductosCategoriasComponent implements OnInit {
  public columnDefs: any;
  public defaultColDef: any;
  public gridOptions = {};
  private gridApi: any;
  public frameworkComponents: any;

  public rowData: Variante[] = [];

  public productoId!: number;
  public producto!: Producto;

  public categoriasProductos!: any[];
  // public actualizarVariante!: Variante;

  public categorias!: Categoria[];
  public productos!: Producto[];

  formularioNuevaCategoriaProducto = new FormGroup({
    Producto: new FormControl('', [Validators.required]),
    Categoria: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriasService: CategoriasService,
    private productosService: ProductosService
  ) {}

  async ngOnInit(): Promise<void> {
    this.configuracionGrid();
    await this.getCategoriasProductos();
    // await this.getDetallesProducto();
  }

  // getDetallesProducto() {
  //   this.productosService.getProducto(this.productoId).subscribe({
  //     next: response => {
  //       this.producto = response;
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     },
  //   });
  // }

  // getCategoriasProductos() {
  //   this.productosService.getVarianteProductoById(productoId, varianteId).subscribe({
  //     next: response => {
  //       this.actualizarVariante = response;
  //       this.formularioActualizarVarianteProducto.patchValue(response);
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     },
  //   });
  // }

  getCategoriasProductos() {
    this.categoriasService.getCategoriasProductos().subscribe({
      next: (response: any[]) => {
        this.categoriasProductos = response;
        this.rowData = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });

    this.categoriasService.getCategorias().subscribe({
      next: (response: any[]) => {
        this.categorias = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });

    this.productosService.getProductos().subscribe({
      next: (response: any[]) => {
        this.productos = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  configuracionGrid() {
    this.columnDefs = [
      {
        headerName: 'Nombre Producto',
        field: 'NombreProducto',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Nombre Categoria',
        field: 'NombreCategoria',
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Acciones',
        field: 'ProductoId',
        minWidth: 210,
        filter: 'agSetColumnFilter',
        cellRenderer: (params: { value: string }) => {
          return '<a id="borarProductoCategoria" matTooltip="Borrar Producto Categoría" data-action="borarProductoCategoria"><i class="fa-solid fa-trash ms-2">&nbsp;&nbsp;</i>Borrar</a>';
        },
      },
    ];
    this.defaultColDef = {
      filterParams: {
        buttons: ['apply', 'reset'],
        closeOnApply: true,
      },
      suppressMenu: true,
      sortable: true,
      filter: true,
      editable: false,
      resizable: true,
      floatingFilter: true,
    };
  }

  onGridReady(params: { api: any; columnApi: any }) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.sizeColumnsToFit();
  }
  //#endregion CONFIGURACIONES GRID

  onCellClicked(params: any) {
    const action = params.event.target.dataset.action;
    if (action === 'borarProductoCategoria') {
      const categoriaProducto: any = params.data;
      console.log(categoriaProducto);
      this.categoriasService
        .deleteCategoriasProducto(Number(categoriaProducto.CategoriaId), Number(categoriaProducto.ProductoId))
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.ngOnInit();
          },
          error: (error: any) => {
            console.error(error);
          },
        });
    }
  }

  guardarFormulario() {
    const categoriaProducto = this.formularioNuevaCategoriaProducto.value;
    const productoId = categoriaProducto.Producto;
    const categoriaId = categoriaProducto.Categoria;

    if (this.formularioNuevaCategoriaProducto.valid) {
      this.categoriasService.postCategoriasProducto(Number(categoriaId), Number(productoId)).subscribe({
        next: (response: any) => {
          console.log(response);
          this.ngOnInit();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }
}
