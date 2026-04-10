import { Component } from '@angular/core';
import { ProductFormComponent } from '../products/components/product-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {}
