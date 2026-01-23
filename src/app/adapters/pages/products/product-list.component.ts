import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../application/services/product.service';
import { ProductResponseDTO } from '../../../application/dto/product-response.dto';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  allProducts: ProductResponseDTO[] = [];
  filteredProducts: ProductResponseDTO[] = [];
  currentCategory: string = 'TODOS';

  // Modal Delete
  showDeleteModal = false;
  productToDelete: { id: number, name: string } | null = null;

  // Paginación de 10 elementos
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Escucha cambios en los parámetros de la URL para filtrar dinámicamente
    this.route.params.subscribe(params => {
      this.currentCategory = params['categoryName'] || 'TODOS';
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  /**
   * Carga la lista de productos desde el backend.
   */
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyFilter();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  /**
   * Filtra los productos según la categoría seleccionada en la URL.
   */
  applyFilter(): void {
    if (this.currentCategory === 'TODOS') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(p =>
        (p.category?.translations?.[0]?.name) === this.currentCategory
      );
    }
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  /**
   * Retorna los productos correspondientes a la página actual.
   */
  get paginatedProducts(): ProductResponseDTO[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  // --- MÉTODOS DE NAVEGACIÓN Y PAGINACIÓN ---

  changePage(page: number): void {
    this.currentPage = page;
  }

  openAddModal(): void {
    this.router.navigate(['/admin/productos/nuevo']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/admin/productos/editar', id]);
  }

  // --- LÓGICA DE ACCIONES Y MODAL ---

  handleImageError(imgElement: HTMLImageElement) {
    imgElement.onerror = null;
    imgElement.src = 'https://placehold.co/200x200?text=Sin+Imagen';
  }

  getNameEs(p: ProductResponseDTO): string {
    return p.translations?.find(t => t.languageCode === 'es')?.name || 'Sin nombre';
  }

  triggerDelete(p: ProductResponseDTO) {
    this.productToDelete = { id: p.id, name: this.getNameEs(p) };
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe(() => {
        this.loadProducts();
        this.cancelDelete();
      });
    }
  }

  toggleProductStatus(p: ProductResponseDTO) {
    this.productService.toggleStatus(p.id).subscribe(() => p.isActive = !p.isActive);
  }

  // --- LÓGICA DE REORDENAMIENTO ACTUALIZADA ---

  moveUp(p: ProductResponseDTO) {
    this.productService.reorderProduct(p.id, 'up').subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error al subir producto:', err)
    });
  }

  moveDown(p: ProductResponseDTO) {
    this.productService.reorderProduct(p.id, 'down').subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error al bajar producto:', err)
    });
  }
}
