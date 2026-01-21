import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importamos withFetch
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Habilitamos fetch para resolver el aviso NG02801 y mejorar el rendimiento en SSR
    provideHttpClient(withFetch())
  ]
};
