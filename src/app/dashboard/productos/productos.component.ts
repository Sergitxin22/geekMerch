import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from '../../interfaces/producto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  public columnDefs: any;
  public defaultColDef: any;
  public gridOptions = {};
  private gridApi: any;
  public frameworkComponents: any;

  public rowData: Producto[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private productosService: ProductosService
  ) {
    // this.configuracionGridConstructor();
  }

  async ngOnInit(): Promise<void> {
    this.configuracionGrid();
    await this.getProductosList();
  }

  getProductosList() {
    this.productosService.getProductos().subscribe({
      next: (response: Producto[]) => {
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
        headerName: 'Nombre Producto',
        field: 'Nombre',
        filter: 'agTextColumnFilter', // maxWidth: 140
      },
      {
        headerName: 'Precio',
        field: 'Precio',
        filter: 'agNumberColumnFilter',
        // filterParams: {
        // valueFormatter: (params: any) => HelperTipos.textoSiNo(params.value + '' === 'true'),
        // buttons: ['apply', 'reset'],
        // closeOnApply: true,
        // },
        cellRenderer: (params: { value: number }) => {
          return (
            (Math.round(params.value * 100) / 100).toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + ' €'
          );
        },
      },
      {
        headerName: 'Oferta',
        field: 'Oferta',
        // filter: 'agTextColumnFilter',
        cellRenderer: (params: { value: string }) => {
          return params.value ? 'Sí' : 'No';
        },
      },
      {
        headerName: 'Precio sin Oferta',
        field: 'PrecioAnterior',
        filter: 'agNumberColumnFilter',
        cellRenderer: (params: { value: number }) => {
          return (
            (Math.round(params.value * 100) / 100).toLocaleString('es-ES', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) + ' €'
          );
        },
      },
      {
        headerName: 'Acciones',
        field: 'ProductoId',
        minWidth: 210,
        filter: 'agSetColumnFilter',
        cellRenderer: (params: { value: string }) => {
          return '<a id="verVariacionesProducto" matTooltip="Ver Variaciones Producto" data-action="verVariacionesProducto"><i class="fa-solid fa-file">&nbsp;&nbsp;</i>Variantes</a><a id="verProducto" matTooltip="Ver Producto" data-action="verProducto"><i class="fa-solid fa-file ms-2">&nbsp;&nbsp;</i>Ver</a><a id="editarProducto" matTooltip="Editar Producto" data-action="editarProducto"><i class="fa-solid fa-pencil ms-2">&nbsp;&nbsp;</i>Editar</a><a id="borarProducto" matTooltip="Borrar Oferta" data-action="borarProducto"><i class="fa-solid fa-trash ms-2">&nbsp;&nbsp;</i>Borrar</a>';
        },
        // valueFormatter: this.dateFormatter,
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

    if (action === 'verVariacionesProducto') {
      const productoId: number = params.data.ProductoId;
      const url = this.router.createUrlTree([`./variaciones/${productoId}`], { relativeTo: this.route }).toString();
      window.open(url, '_blank');
    }

    if (action === 'verProducto') {
      const productoId: number = params.data.ProductoId;
      const url = this.router.createUrlTree([`/producto/${productoId}`]).toString();
      window.open(url, '_blank');
    }

    if (action === 'editarProducto') {
      const productoId: number = params.data.ProductoId;
      const url = this.router.createUrlTree([`./editar/${productoId}`], { relativeTo: this.route }).toString();
      window.open(url);
    }

    if (action === 'borarProducto') {
      const productoId: number = params.data.ProductoId;
      this.productosService.deleteProducto(productoId).subscribe({
        next: (response: any) => {
          this.ngOnInit();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
    }
  }
}
