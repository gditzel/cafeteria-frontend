import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  role: string;
}

const STORAGE_KEY = 'cafeteria_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(username: string): Observable<UserDto> {
    return this.http
      .post<UserDto>(`${this.baseUrl}/login`, { username })
      .pipe(tap((user) => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))));
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  getStoredUser(): UserDto | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDto;
    } catch {
      return null;
    }
  }
}
