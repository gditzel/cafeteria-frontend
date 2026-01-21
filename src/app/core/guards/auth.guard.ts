import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificamos si el usuario está logueado
  if (!authService.isLoggedIn()) {
    console.warn('Acceso denegado: Usuario no autenticado');
    router.navigate(['/login']).then();
    return false;
  }

  // 2. Verificamos los roles permitidos para esta ruta definidos en app.routes.ts
  const expectedRoles: string[] = route.data['expectedRoles'];
  const userRole = authService.getUserRole();

  if (expectedRoles && !expectedRoles.includes(userRole)) {
    // Si el usuario no tiene el rol necesario (ej: un MOZO intentando entrar a ADMIN)
    console.warn(`Acceso denegado para el rol: ${userRole}. Se requiere: ${expectedRoles}`);

    // Redirigir según el rol que sí tiene para que no quede atrapado
    if (userRole === 'WAITER') {
      router.navigate(['/mozos/mesas']).then();
    } else if (userRole === 'COOK') {
      router.navigate(['/cocina/dashboard']).then();
    } else {
      router.navigate(['/login']).then();
    }
    return false;
  }

  return true;
};
