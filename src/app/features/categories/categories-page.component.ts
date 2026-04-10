import { Component } from '@angular/core';
import { CategoryFormComponent } from './category-form.component';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CategoryFormComponent],
  templateUrl: './categories-page.component.html',
})
export class CategoriesPageComponent {}
