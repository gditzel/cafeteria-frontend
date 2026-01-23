import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseDTO } from '../dto/product-response.dto';
import { PRODUCT_REPOSITORY, ProductRepository } from '../ports/product-repository.port';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private productRepository: ProductRepository
  ) {}

  getProducts(): Observable<ProductResponseDTO[]> {
    return this.productRepository.getProducts();
  }

  getActiveProducts(): Observable<ProductResponseDTO[]> {
    return this.productRepository.getActiveProducts();
  }

  getProductById(id: number): Observable<ProductResponseDTO> {
    return this.productRepository.getProductById(id);
  }

  saveProduct(product: any, image: File | null): Observable<ProductResponseDTO> {
    return this.productRepository.saveProduct(product, image);
  }

  reorderProduct(id: number, direction: 'up' | 'down'): Observable<void> {
    return this.productRepository.reorderProduct(id, direction);
  }

  toggleStatus(id: number): Observable<void> {
    return this.productRepository.toggleStatus(id);
  }

  deleteProduct(id: number): Observable<void> {
    return this.productRepository.deleteProduct(id);
  }
}
