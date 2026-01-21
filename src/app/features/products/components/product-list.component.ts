import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, ProductResponseDTO } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  showDeleteModal = false;
  productToDelete: { id: number, name: string } | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  handleImageError(imgElement: HTMLImageElement): void {
    imgElement.onerror = null;
    imgElement.src = 'https://placehold.co/200x200?text=Sin+Imagen';
  }

  getNameEs(p: ProductResponseDTO): string {
    const translation = p.translations?.find(t => t.languageCode === 'es');
    return translation ? translation.name : 'Sin nombre';
  }

  triggerDelete(p: ProductResponseDTO): void {
    this.productToDelete = { id: p.id, name: this.getNameEs(p) };
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelDelete();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.cancelDelete();
        }
      });
    }
  }

  editProduct(id: number): void {
    this.router.navigate(['/admin/productos/editar', id]);
  }

  openAddModal(): void {
    this.router.navigate(['/admin/productos/nuevo']);
  }

  toggleProductStatus(p: ProductResponseDTO): void {
    this.productService.toggleStatus(p.id).subscribe(() => {
      p.isActive = !p.isActive;
    });
  }

  moveUp(p: ProductResponseDTO): void {
    this.productService.reorderProduct(p.id, 'up').subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error al subir:', err)
    });
  }

  moveDown(p: ProductResponseDTO): void {
    this.productService.reorderProduct(p.id, 'down').subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error al bajar:', err)
    });
  }
}
