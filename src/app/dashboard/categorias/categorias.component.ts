import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from '../../interfaces/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { Variante } from 'src/app/interfaces/variante';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Categoria } from 'src/app/interfaces/categoria';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  public columnDefs: any;
  public defaultColDef: any;
  public gridOptions = {};
  private gridApi: any;
  public frameworkComponents: any;

  public rowData: Categoria[] = [];

  // public productoId!: number;
  // public producto!: Producto;

  // public formularioActualizarVarianteProducto!: FormGroup;
  public categorias!: Categoria[];
  // public actualizarVariante!: Variante;

  public formularioActualizarCategoria!: FormGroup;
  public actualizarCategoria!: Categoria;

  formularioNuevaCategoria = new FormGroup({
    Nombre: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private categoriasService: CategoriasService
  ) {
    this.formularioActualizarCategoria = this.formBuilder.group({
      Nombre: new FormControl('', [Validators.required, Validators.minLength(1)]),
    });
  }

  async ngOnInit(): Promise<void> {
    // this.route.params.subscribe(params => {
    //   this.productoId = params['id'];
    // });

    this.configuracionGrid();
    // await this.getVariantesProductoList();
    await this.getCategorias();
  }

  getCategorias() {
    this.categoriasService.getCategorias().subscribe({
      next: response => {
        this.categorias = response;
        this.rowData = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  getCategoriaById(categoriaId: number) {
    console.log(categoriaId);

    this.categoriasService.getCategoria(categoriaId).subscribe({
      next: response => {
        console.log(response);

        this.actualizarCategoria = response;
        this.formularioActualizarCategoria.patchValue(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  // getVariantesProductoList() {
  //   this.productosService.getVariantesProducto(this.productoId).subscribe({
  //     next: (response: Variante[]) => {
  //       this.variantes = response;
  //       this.rowData = response;
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     },
  //   });
  // }

  configuracionGrid() {
    this.columnDefs = [
      {
        headerName: 'Nombre',
        field: 'Nombre',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Acciones',
        field: 'ProductoId',
        minWidth: 210,
        filter: 'agSetColumnFilter',
        cellRenderer: (params: { value: string }) => {
          return '<a id="editarCategoria" matTooltip="Editar Categoria" data-action="editarCategoria" data-bs-toggle="modal" data-bs-target="#editarModal"><i class="fa-solid fa-pencil ms-2">&nbsp;&nbsp;</i>Editar</a><a id="borrarCategoria" matTooltip="Borrar Categoría" data-action="borrarCategoria"><i class="fa-solid fa-trash ms-2">&nbsp;&nbsp;</i>Borrar</a>';
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

    if (action === 'editarCategoria') {
      const categoria: Categoria = params.data;

      this.getCategoriaById(categoria.CategoriaId);
    }

    if (action === 'borrarCategoria') {
      const categoria: Categoria = params.data;
      const categoriaId: number = categoria.CategoriaId;

      this.categoriasService.deleteCategoria(categoriaId).subscribe({
        next: response => {
          console.log(response);
          this.ngOnInit();
        },
        error: (error: any) => {
          console.error(error);
        },
      });

      // const url = this.router.createUrlTree([`/producto/${productoId}`]).toString();
      // window.open(url, '_blank');
    }
  }

  guardarFormulario() {
    const categoria = this.formularioNuevaCategoria.value;

    if (this.formularioNuevaCategoria.valid) {
      this.categoriasService.postCategoria(categoria).subscribe({
        next: (response: any) => {
          console.log(response);
          this.ngOnInit();
          this.formularioNuevaCategoria.reset();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }

  actualizarFormulario() {
    const categoria = this.formularioActualizarCategoria.value;
    if (this.formularioActualizarCategoria.valid) {
      console.log('dentro');
      this.categoriasService.putCategoria(this.actualizarCategoria.CategoriaId, categoria).subscribe({
        next: (response: any) => {
          console.log(response);
          this.ngOnInit();
          this.formularioActualizarCategoria.reset();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }
}
