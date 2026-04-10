import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryEventsService } from '../../services/category-events.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryEvents = inject(CategoryEventsService);

  loading = false;

  form = this.fb.nonNullable.group({
    nameEs: ['', Validators.required],
    nameEn: ['', Validators.required],
    isActive: [true],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const payload = {
      isActive: v.isActive,
      translations: [
        { languageCode: 'es', name: v.nameEs.trim() },
        { languageCode: 'en', name: v.nameEn.trim() },
      ],
    };

    this.loading = true;
    this.productService.createCategory(payload).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset({ nameEs: '', nameEn: '', isActive: true });
        this.categoryEvents.notifyCategoriesChanged();
        alert('Categoría guardada.');
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('No se pudo crear la categoría. Revisá el backend y la consola.');
      },
    });
  }
}
