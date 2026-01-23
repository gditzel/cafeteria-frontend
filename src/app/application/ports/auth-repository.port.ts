import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthRepository {
  login(username: string): Observable<any>;
}

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
