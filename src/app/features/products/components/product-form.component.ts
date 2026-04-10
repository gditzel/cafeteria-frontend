import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService, CategoryDto } from '../../../services/product.service';
import { CategoryEventsService } from '../../../services/category-events.service';

interface CategoryOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  categories: CategoryOption[] = [];
  categoriesError = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryEvents: CategoryEventsService
  ) {
    this.productForm = this.fb.group({
      categoryId: [null as number | null, Validators.required],
      nameEs: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionEs: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      price: [null as number | null, [Validators.required, Validators.min(0)]],
      stock: [null as number | null, [Validators.required, Validators.min(0)]],
    });

    this.categoryEvents.categoriesChanged$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadCategories());
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.productService.getActiveCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map((c) => ({
          id: c.id,
          label: categoryLabel(c),
        }));
        this.categoriesError =
          this.categories.length === 0
            ? 'No hay categorías activas. Creálas en la sección Categorías del menú superior.'
            : '';
      },
      error: () => {
        this.categoriesError =
          'No se pudieron cargar las categorías. ¿Está el backend en http://localhost:8080?';
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;
  }

  private toProductPayload(v: {
    categoryId: number;
    nameEs: string;
    nameEn: string;
    descriptionEs: string;
    descriptionEn: string;
    price: number;
    stock: number;
  }): object {
    return {
      isActive: true,
      price: v.price,
      stock: v.stock,
      category: { id: v.categoryId },
      translations: [
        { languageCode: 'es', name: v.nameEs.trim(), description: v.descriptionEs.trim() },
        { languageCode: 'en', name: v.nameEn.trim(), description: v.descriptionEn.trim() },
      ],
    };
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.selectedFile) {
      alert('Por favor, completa todos los campos (incluida la categoría) y selecciona una imagen.');
      return;
    }

    const raw = this.productForm.getRawValue();
    const payload = this.toProductPayload({
      categoryId: raw.categoryId,
      nameEs: raw.nameEs,
      nameEn: raw.nameEn,
      descriptionEs: raw.descriptionEs,
      descriptionEn: raw.descriptionEn,
      price: Number(raw.price),
      stock: Number(raw.stock),
    });

    this.loading = true;
    this.productService.uploadProduct(payload, this.selectedFile).subscribe({
      next: () => {
        alert('¡Producto guardado con éxito!');
        this.productForm.reset({ categoryId: null });
        this.selectedFile = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al subir producto', err);
        const msg =
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          'Revisá la consola del backend (Java) para el detalle.';
        alert(`Error al guardar: ${msg}`);
        this.loading = false;
      },
    });
  }
}

function categoryLabel(c: CategoryDto): string {
  const tr = c.translations ?? [];
  const es = tr.find((t) => t.languageCode === 'es');
  const any = tr[0];
  return es?.name ?? any?.name ?? `Categoría #${c.id}`;
}
