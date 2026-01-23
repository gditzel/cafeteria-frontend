export interface CategoryTranslation {
  id?: number;
  languageCode: string;
  name: string;
}

export interface Category {
  id?: number;
  isActive: boolean;
  sortOrder?: number;
  translations: CategoryTranslation[];
  productCount?: number;
}
