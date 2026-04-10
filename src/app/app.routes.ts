import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { AdminShellComponent } from './layout/admin-shell.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { CategoriesPageComponent } from './features/categories/categories-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'categories', component: CategoriesPageComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
