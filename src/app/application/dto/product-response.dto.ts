import { Category } from '../../domain/models/category.model';
import { ProductTranslationDTO } from './product-translation.dto';

export interface ProductResponseDTO {
  id: number;
  price: number;
  stock: number;
  isActive: boolean;
  sortOrder: number;
  translations: ProductTranslationDTO[];
  category?: Category;
}
