import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Recuperar sesión persistente al iniciar la app
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username }).pipe(
      tap(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);

        // Redirección automática según el rol recibido del servidor
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
