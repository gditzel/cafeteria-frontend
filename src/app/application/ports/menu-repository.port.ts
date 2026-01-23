import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductResponseDTO } from '../dto/product-response.dto';

export interface MenuRepository {
  getMenuProducts(): Observable<ProductResponseDTO[]>;
}

export const MENU_REPOSITORY = new InjectionToken<MenuRepository>('MENU_REPOSITORY');
