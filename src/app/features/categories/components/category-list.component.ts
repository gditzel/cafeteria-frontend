import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { Category, CategoryTranslation } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  showFormModal = false;
  showDeleteModal = false;
  isEditMode = false;
  categorySelected: Category | null = null;

  categoryForm = {
    id: null as number | null,
    nameEs: '',
    nameEn: '',
    isActive: true,
    sortOrder: 0
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: Category[]) => this.categories = data,
      error: (err: any) => console.error('Error al cargar categorías:', err)
    });
  }

  // Solución para las imágenes
  handleImageError(imgElement: HTMLImageElement): void {
    imgElement.onerror = null; // Corta el bucle infinito
    imgElement.src = 'https://placehold.co/200x200?text=Sin+Imagen';
  }

  moveUp(category: Category): void {
    if (!category.id) return;
    this.categoryService.reorderCategory(category.id, 'up').subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Error al mover categoría:', err)
    });
  }

  moveDown(category: Category): void {
    if (!category.id) return;
    this.categoryService.reorderCategory(category.id, 'down').subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Error al mover categoría:', err)
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.categoryForm = { id: null, nameEs: '', nameEn: '', isActive: true, sortOrder: 0 };
    this.showFormModal = true;
  }

  openEditModal(category: Category): void {
    this.isEditMode = true;
    const es = category.translations.find(t => t.languageCode === 'es');
    const en = category.translations.find(t => t.languageCode === 'en');
    this.categoryForm = {
      id: category.id || null,
      nameEs: es?.name || '',
      nameEn: en?.name || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder || 0
    };
    this.showFormModal = true;
  }

  saveCategory(): void {
    if (!this.categoryForm.nameEs || !this.categoryForm.nameEn) return;
    const categoryData: Category = {
      id: this.categoryForm.id || undefined,
      isActive: this.categoryForm.isActive,
      sortOrder: this.categoryForm.sortOrder,
      translations: [
        { languageCode: 'es', name: this.categoryForm.nameEs },
        { languageCode: 'en', name: this.categoryForm.nameEn }
      ]
    };
    this.categoryService.saveCategory(categoryData).subscribe({
      next: () => {
        this.loadCategories();
        this.showFormModal = false;
      },
      error: (err: any) => console.error(err)
    });
  }

  getName(category: Category, lang: string): string {
    const translation = category.translations.find((t: CategoryTranslation) => t.languageCode === lang);
    return translation ? translation.name : 'N/A';
  }

  hasProducts(category: Category): boolean {
    return (category.productCount || 0) > 0;
  }

  openDeleteModal(category: Category): void {
    if (this.hasProducts(category)) {
      alert("No se puede eliminar: Esta categoría tiene productos asociados.");
      return;
    }
    this.categorySelected = category;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.categorySelected?.id) {
      this.categoryService.deleteCategory(this.categorySelected.id).subscribe({
        next: () => {
          this.loadCategories();
          this.showDeleteModal = false;
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  toggleStatus(category: Category): void {
    category.isActive = !category.isActive;
    this.categoryService.saveCategory(category).subscribe({
      error: (err: any) => {
        category.isActive = !category.isActive;
        alert("Error al actualizar el estado");
      }
    });
  }
}
