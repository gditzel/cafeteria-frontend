import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/users';
  private readonly currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser) as UserDto);
        } catch {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(username: string): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/login`, { username }).pipe(
      tap((user) => {
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

        void this.router.navigate([targetRoute]);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    void this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value != null;
  }

  getUserRole(): string {
    return this.currentUserSubject.value?.role ?? '';
  }

  getStoredUser(): UserDto | null {
    return this.currentUserSubject.value;
  }
}
