import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Se añade Location
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Se añade RouterModule para el HTML
import { ProductService } from '../../../application/services/product.service';
import { CategoryService } from '../../../application/services/category.service';
import { Category } from '../../../domain/models/category.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  categories: Category[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location // Inyectamos el servicio para el botón cancelar
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      categoryId: [null, Validators.required],
      nameEs: ['', Validators.required],
      descEs: [''],
      nameEn: ['', Validators.required],
      descEn: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => this.categories = data);

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.isEditMode = true;
      this.productService.getProductById(this.productId).subscribe({
        next: (data) => {
          const es = data.translations?.find(t => t.languageCode === 'es');
          const en = data.translations?.find(t => t.languageCode === 'en');

          // Seteamos la URL inicial de la imagen en modo edición
          this.imagePreview = `http://localhost:8080/api/products/${this.productId}/image`;

          this.productForm.patchValue({
            price: data.price,
            stock: data.stock,
            isActive: data.isActive,
            categoryId: data.category?.id,
            nameEs: es?.name || '',
            descEs: es?.description || '',
            nameEn: en?.name || '',
            descEn: en?.description || ''
          });
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para el botón Cancelar que definimos en el HTML
  onCancel(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const val = this.productForm.value;

    const productToSave = {
      id: this.isEditMode ? this.productId : null,
      price: val.price,
      stock: val.stock,
      isActive: val.isActive,
      category: { id: Number(val.categoryId) },
      translations: [
        { languageCode: 'es', name: val.nameEs, description: val.descEs },
        { languageCode: 'en', name: val.nameEn, description: val.descEn }
      ]
    };

    // Buscamos el nombre de la categoría para redirigir correctamente al finalizar
    const selectedCat = this.categories.find(c => c.id === Number(val.categoryId));
    const categoryName = selectedCat?.translations?.find(t => t.languageCode === 'es')?.name || '';

    this.productService.saveProduct(productToSave, this.selectedFile).subscribe({
      next: () => {
        // Redirigimos a la vista de la categoría específica
        if (categoryName) {
          this.router.navigate(['/admin/productos/categoria', categoryName]);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.loading = false;
        alert("Error al guardar: Verifica los logs del servidor.");
      }
    });
  }
}
