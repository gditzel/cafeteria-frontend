import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../features/models/category.model';

export interface ProductTranslationDTO {
  id?: number;
  languageCode: string;
  name: string;
  description: string;
}

export interface ProductResponseDTO {
  id: number;
  price: number;
  stock: number;
  isActive: boolean;
  sortOrder: number;
  translations: ProductTranslationDTO[];
  category?: Category;
}

export interface CategoryDto {
  id: number;
  translations?: { languageCode: string; name: string }[];
}

const API_BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsUrl = `${API_BASE}/products`;

  constructor(private http: HttpClient) {}

  getActiveCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${API_BASE}/categories/active`);
  }

  createCategory(payload: object): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${API_BASE}/categories`, payload);
  }

  getProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(this.productsUrl);
  }

  getActiveProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.productsUrl}/active`);
  }

  getProductById(id: number): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.productsUrl}/${id}`);
  }

  saveProduct(product: object, image: File | null): Observable<ProductResponseDTO> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }
    return this.http.post<ProductResponseDTO>(this.productsUrl, formData);
  }

  uploadProduct(product: object, image: File): Observable<unknown> {
    return this.saveProduct(product, image);
  }

  reorderProduct(id: number, direction: 'up' | 'down'): Observable<void> {
    return this.http.post<void>(`${this.productsUrl}/${id}/reorder?direction=${direction}`, {});
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.productsUrl}/${id}/toggle`, {});
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.productsUrl}/${id}`);
  }
}
