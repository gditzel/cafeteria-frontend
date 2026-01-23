import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseDTO } from '../dto/product-response.dto';

export interface ProductRepository {
  getProducts(): Observable<ProductResponseDTO[]>;
  getActiveProducts(): Observable<ProductResponseDTO[]>;
  getProductById(id: number): Observable<ProductResponseDTO>;
  saveProduct(product: any, image: File | null): Observable<ProductResponseDTO>;
  reorderProduct(id: number, direction: 'up' | 'down'): Observable<void>;
  toggleStatus(id: number): Observable<void>;
  deleteProduct(id: number): Observable<void>;
}

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('PRODUCT_REPOSITORY');
