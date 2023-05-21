import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from '../../interfaces/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { Variante } from 'src/app/interfaces/variante';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-variaciones-producto',
  templateUrl: './variaciones-producto.component.html',
  styleUrls: ['./variaciones-producto.component.css'],
})
export class VariacionesProductoComponent implements OnInit {
  public columnDefs: any;
  public defaultColDef: any;
  public gridOptions = {};
  private gridApi: any;
  public frameworkComponents: any;

  public rowData: Variante[] = [];

  public productoId!: number;
  public producto!: Producto;

  public formularioActualizarVarianteProducto!: FormGroup;
  public variantes!: Variante[];
  public actualizarVariante!: Variante;

  formularioNuevaVarianteProducto = new FormGroup({
    Descripcion: new FormControl('', [Validators.required, Validators.minLength(1)]),
    Stock: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productosService: ProductosService
  ) {
    this.formularioActualizarVarianteProducto = this.formBuilder.group({
      Descripcion: new FormControl('', [Validators.required, Validators.minLength(1)]),
      Stock: new FormControl('', [Validators.required, Validators.min(0)]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.productoId = params['id'];
    });

    this.configuracionGrid();
    await this.getVariantesProductoList();
    await this.getDetallesProducto();
  }

  getDetallesProducto() {
    this.productosService.getProducto(this.productoId).subscribe({
      next: response => {
        this.producto = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  getVarianteProductoById(productoId: number, varianteId: number) {
    this.productosService.getVarianteProductoById(productoId, varianteId).subscribe({
      next: response => {
        this.actualizarVariante = response;
        this.formularioActualizarVarianteProducto.patchValue(response);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  getVariantesProductoList() {
    this.productosService.getVariantesProducto(this.productoId).subscribe({
      next: (response: Variante[]) => {
        this.variantes = response;
        this.rowData = response;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  configuracionGrid() {
    this.columnDefs = [
      {
        headerName: 'Tipo/Talla',
        field: 'Descripcion',
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Stock',
        field: 'Stock',
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Acciones',
        field: 'ProductoId',
        minWidth: 210,
        filter: 'agSetColumnFilter',
        cellRenderer: (params: { value: string }) => {
          return '<a id="editarVarianteProducto" matTooltip="Editar Variante Producto" data-action="editarVarianteProducto" data-bs-toggle="modal" data-bs-target="#editarModal"><i class="fa-solid fa-pencil ms-2">&nbsp;&nbsp;</i>Editar</a><a id="borarVarianteProducto" matTooltip="Borrar Variante Producto" data-action="borarVarianteProducto"><i class="fa-solid fa-trash ms-2">&nbsp;&nbsp;</i>Borrar</a>';
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

    if (action === 'editarVarianteProducto') {
      const variante: Variante = params.data;
      this.getVarianteProductoById(variante.ProductoId, variante.Id);

      // const url = this.router.createUrlTree([`./variaciones/${productoId}`], { relativeTo: this.route }).toString();
      // window.open(url, '_blank');
    }

    if (action === 'borarVarianteProducto') {
      const variante: Variante = params.data;
      const varianteId: number = variante.Id;
      const productoId: number = variante.ProductoId;

      this.productosService.deleteVariantesProducto(varianteId, productoId).subscribe({
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
    const variante = this.formularioNuevaVarianteProducto.value;

    if (this.formularioNuevaVarianteProducto.valid) {
      this.productosService.postVariantesProducto(variante, this.productoId).subscribe({
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

  actualizarFormulario() {
    const variante = this.formularioActualizarVarianteProducto.value;

    if (this.formularioActualizarVarianteProducto.valid) {
      console.log('dentro');
      this.productosService
        .putVarianteProducto(this.actualizarVariante.ProductoId, this.actualizarVariante.Id, variante)
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
}
