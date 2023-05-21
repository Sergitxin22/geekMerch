import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DashboardComponent } from './dashboard.component';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { ProductosComponent } from './productos/productos.component';
import { AgGridModule } from 'ag-grid-angular';
import { VariacionesProductoComponent } from './variaciones-producto/variaciones-producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosCategoriasComponent } from './productos-categorias/productos-categorias.component';

@NgModule({
  declarations: [DashboardComponent, NuevoProductoComponent, ProductosComponent, VariacionesProductoComponent, EditarProductoComponent, CategoriasComponent, ProductosCategoriasComponent],
  imports: [CommonModule, DashboardRoutingModule, CKEditorModule, ReactiveFormsModule, FormsModule, AgGridModule],
})
export class DashboardModule {}
