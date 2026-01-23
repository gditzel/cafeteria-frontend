import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MENU_REPOSITORY, MenuRepository } from '../ports/menu-repository.port';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(
    @Inject(MENU_REPOSITORY) private menuRepository: MenuRepository
  ) {}

  getMenuByCategory(): Observable<any> {
    return this.menuRepository.getMenuProducts().pipe(
      map(products => {
        return products.reduce((acc: any, product) => {
          const catName = product.category?.translations?.find(t => t.languageCode === 'es')?.name || 'Otros';
          if (!acc[catName]) acc[catName] = [];
          acc[catName].push(product);
          return acc;
        }, {});
      })
    );
  }
}
