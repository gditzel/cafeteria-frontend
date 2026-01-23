import { Routes } from '@angular/router';
import { ProductListComponent } from './adapters/pages/products/product-list.component';
import { ProductFormComponent } from './adapters/pages/products/product-form.component';
import { WaiterListComponent } from './adapters/pages/waiters/waiter-list.component';
import { WaiterFormComponent } from './adapters/pages/waiters/waiter-form.component';
import { WaiterTablesComponent } from './adapters/pages/tables/waiter-tables.component';
import { WaiterOrderComponent } from './adapters/pages/waiters/waiter-order.component';
import { CustomerMenuComponent } from './adapters/pages/menu/customer-menu.component';
import { LoginComponent } from './adapters/pages/login/login.component';
import { authGuard } from './adapters/guards/auth.guard';
import { KitchenDashboardComponent } from './adapters/pages/kitchen/kitchen-dashboard.component';
import { CategoryListComponent } from './adapters/pages/categories/category-list.component';
import { DashboardComponent } from './adapters/pages/dashboard/dashboard.component'; // Importar el nuevo componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // PANTALLA PRINCIPAL POST-LOGIN
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] }
  },

  // RUTAS DE ADMINISTRACIÓN - PRODUCTOS (Filtrado obligatorio por categoría)
  {
    path: 'admin/productos/categoria/:categoryName',
    component: ProductListComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] }
  },
  {
    path: 'admin/productos/nuevo',
    component: ProductFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] }
  },
  {
    path: 'admin/productos/editar/:id',
    component: ProductFormComponent,
    canActivate: [authGuard],
    data: { expectedRoles: ['ADMIN'] }
  },

  // CATEGORÍAS Y MOZOS
  { path: 'admin/categorias', component: CategoryListComponent, canActivate: [authGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'admin/mozos', component: WaiterListComponent, canActivate: [authGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'admin/mozos/nuevo', component: WaiterFormComponent, canActivate: [authGuard], data: { expectedRoles: ['ADMIN'] } },
  { path: 'admin/mozos/editar/:id', component: WaiterFormComponent, canActivate: [authGuard], data: { expectedRoles: ['ADMIN'] } },

  // RUTAS DE MOZOS Y COCINA
  { path: 'mozos/mesas', component: WaiterTablesComponent, canActivate: [authGuard], data: { expectedRoles: ['WAITER', 'ADMIN'] } },
  { path: 'mozos/pedido/:tableId', component: WaiterOrderComponent, canActivate: [authGuard], data: { expectedRoles: ['WAITER', 'ADMIN'] } },
  { path: 'cocina/dashboard', component: KitchenDashboardComponent, canActivate: [authGuard], data: { expectedRoles: ['COOK', 'ADMIN'] } },

  // MENÚ PÚBLICO (Sin Guard)
  { path: 'menu', component: CustomerMenuComponent },

  // REDIRECCIONES
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin/dashboard' }
];
