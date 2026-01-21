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
  sortOrder: number; // Cambiado a obligatorio para manejar el orden en el front
  translations: ProductTranslationDTO[];
  category?: Category;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(this.apiUrl);
  }

  getActiveProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(`${this.apiUrl}/active`);
  }

  getProductById(id: number): Observable<ProductResponseDTO> {
    return this.http.get<ProductResponseDTO>(`${this.apiUrl}/${id}`);
  }

  saveProduct(product: any, image: File | null): Observable<ProductResponseDTO> {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(product)], { type: 'application/json' });
    formData.append('product', productBlob);
    if (image) { formData.append('image', image); }
    return this.http.post<ProductResponseDTO>(this.apiUrl, formData);
  }

  reorderProduct(id: number, direction: 'up' | 'down'): Observable<void> {
    // Se envía como query param: ?direction=up
    return this.http.post<void>(`${this.apiUrl}/${id}/reorder?direction=${direction}`, {});
  }

  toggleStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/toggle`, {});
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
