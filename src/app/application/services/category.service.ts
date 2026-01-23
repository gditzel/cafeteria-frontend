import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../domain/models/category.model';
import { CATEGORY_REPOSITORY, CategoryRepository } from '../ports/category-repository.port';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private categoryRepository: CategoryRepository
  ) {}

  getCategories(): Observable<Category[]> {
    return this.categoryRepository.getCategories();
  }

  getActiveCategories(): Observable<Category[]> {
    return this.categoryRepository.getActiveCategories();
  }

  saveCategory(category: Category): Observable<Category> {
    return this.categoryRepository.saveCategory(category);
  }

  reorderCategory(id: number, direction: 'up' | 'down'): Observable<void> {
    return this.categoryRepository.reorderCategory(id, direction);
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoryRepository.deleteCategory(id);
  }
}
