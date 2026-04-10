export interface CategoryTranslation {
  id?: number;
  languageCode: string;
  name: string;
}

export interface Category {
  id?: number;
  isActive: boolean;
  sortOrder?: number; // Agregado
  translations: CategoryTranslation[];
  productCount?: number;
}
