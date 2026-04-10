import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8080/api';

export interface CategoryDto {
  id: number;
  translations?: { languageCode: string; name: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getActiveCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${API_BASE}/categories/active`);
  }

  createCategory(payload: object): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${API_BASE}/categories`, payload);
  }

  uploadProduct(product: object, image: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    formData.append('image', image);
    return this.http.post(`${API_BASE}/products`, formData);
  }
}
