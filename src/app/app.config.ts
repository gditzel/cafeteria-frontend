import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importamos withFetch
import { routes } from './app.routes';
import { CATEGORY_REPOSITORY } from './application/ports/category-repository.port';
import { AUTH_REPOSITORY } from './application/ports/auth-repository.port';
import { MENU_REPOSITORY } from './application/ports/menu-repository.port';
import { ORDER_REPOSITORY } from './application/ports/order-repository.port';
import { PRODUCT_REPOSITORY } from './application/ports/product-repository.port';
import { TABLE_REPOSITORY } from './application/ports/table-repository.port';
import { USER_REPOSITORY } from './application/ports/user-repository.port';
import { HttpAuthRepository } from './infrastructure/repositories/http-auth.repository';
import { HttpCategoryRepository } from './infrastructure/repositories/http-category.repository';
import { HttpMenuRepository } from './infrastructure/repositories/http-menu.repository';
import { HttpOrderRepository } from './infrastructure/repositories/http-order.repository';
import { HttpProductRepository } from './infrastructure/repositories/http-product.repository';
import { HttpTableRepository } from './infrastructure/repositories/http-table.repository';
import { HttpUserRepository } from './infrastructure/repositories/http-user.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Habilitamos fetch para resolver el aviso NG02801 y mejorar el rendimiento en SSR
    provideHttpClient(withFetch()),
    { provide: AUTH_REPOSITORY, useClass: HttpAuthRepository },
    { provide: CATEGORY_REPOSITORY, useClass: HttpCategoryRepository },
    { provide: PRODUCT_REPOSITORY, useClass: HttpProductRepository },
    { provide: MENU_REPOSITORY, useClass: HttpMenuRepository },
    { provide: ORDER_REPOSITORY, useClass: HttpOrderRepository },
    { provide: USER_REPOSITORY, useClass: HttpUserRepository },
    { provide: TABLE_REPOSITORY, useClass: HttpTableRepository }
  ]
};
