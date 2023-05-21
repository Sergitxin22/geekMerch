import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { DashboardComponent } from './dashboard.component';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { ProductosComponent } from './productos/productos.component';
import { VariacionesProductoComponent } from './variaciones-producto/variaciones-producto.component';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosCategoriasComponent } from './productos-categorias/productos-categorias.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'productos',
    component: DashboardComponent,
    children: [
      { path: '', component: ProductosComponent },
      { path: 'nuevo', component: NuevoProductoComponent },
      { path: 'editar/:id', component: EditarProductoComponent },
      { path: 'variaciones/:id', component: VariacionesProductoComponent },
      { path: '**', redirectTo: '' },
    ],
  },
  {
    path: 'categorias',
    component: DashboardComponent,
    children: [
      { path: '', component: CategoriasComponent },
      { path: 'productos', component: ProductosCategoriasComponent },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
