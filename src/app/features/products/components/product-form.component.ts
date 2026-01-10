import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      nameEs: ['', Validators.required],
      nameEn: ['', Validators.required],
      descriptionEs: ['', Validators.required],
      descriptionEn: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.selectedFile) {
      this.loading = true;
      const productData = this.productForm.value;

      this.productService.uploadProduct(productData, this.selectedFile).subscribe({
        next: () => {
          alert('¡Producto guardado con éxito!');
          this.productForm.reset();
          this.selectedFile = null;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al subir producto', err);
          alert('Hubo un error al guardar (Error 500: Revisa la consola de Java)');
          this.loading = false;
        }
      });
    } else {
      alert('Por favor, completa todos los campos y selecciona una imagen.');
    }
  }
}
