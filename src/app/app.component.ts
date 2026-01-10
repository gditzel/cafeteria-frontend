import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './features/products/components/product-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
