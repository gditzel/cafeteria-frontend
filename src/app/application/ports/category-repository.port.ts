import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../domain/models/category.model';

export interface CategoryRepository {
  getCategories(): Observable<Category[]>;
  getActiveCategories(): Observable<Category[]>;
  saveCategory(category: Category): Observable<Category>;
  reorderCategory(id: number, direction: 'up' | 'down'): Observable<void>;
  deleteCategory(id: number): Observable<void>;
}

export const CATEGORY_REPOSITORY = new InjectionToken<CategoryRepository>('CATEGORY_REPOSITORY');
