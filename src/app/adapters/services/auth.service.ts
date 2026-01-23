import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { AuthRepository, AUTH_REPOSITORY } from '../../application/ports/auth-repository.port';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(username: string): Observable<any> {
    return this.authRepository.login(username).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);

        let targetRoute = '/login';
        const role = user.role;

        if (role === 'ADMIN') targetRoute = '/admin/productos';
        else if (role === 'WAITER') targetRoute = '/mozos/mesas';
        else if (role === 'COOK') targetRoute = '/cocina/dashboard';
        else if (role === 'CASHIER') targetRoute = '/caja/dashboard';

        this.router.navigate([targetRoute]);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role || '';
  }
}
