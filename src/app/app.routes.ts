import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/components/product-list.component';
import { ProductFormComponent } from './features/products/components/product-form.component';
import { WaiterListComponent } from './features/waiters/components/waiter-list.component';
import { WaiterFormComponent } from './features/waiters/components/waiter-form.component';
import { WaiterTablesComponent } from './features/tables/components/waiter-tables.component';
import { WaiterOrderComponent } from './features/waiters/components/waiter-order.component';
import { LoginComponent } from './features/login/components/login.component';
import { authGuard } from './core/guards/auth.guard';
import { KitchenDashboardComponent } from './features/kitchen/components/kitchen-dashboard.component';
import { CategoryListComponent } from './features/categories/components/category-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    redirectTo: 'admin/productos',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    redirectTo: 'admin/categorias',
    pathMatch: 'full',
  },

  {
    path: 'admin/productos',
    component: ProductListComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/productos/nuevo',
    component: ProductFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/productos/editar/:id',
    component: ProductFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/categorias',
    component: CategoryListComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/mozos',
    component: WaiterListComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/mozos/nuevo',
    component: WaiterFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },
  {
    path: 'admin/mozos/editar/:id',
    component: WaiterFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] },
  },

  {
    path: 'mozos/mesas',
    component: WaiterTablesComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['WAITER', 'ADMIN'] },
  },
  {
    path: 'mozos/pedido/:tableId',
    component: WaiterOrderComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['WAITER', 'ADMIN'] },
  },

  {
    path: 'cocina/dashboard',
    component: KitchenDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['COOK', 'ADMIN'] },
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
