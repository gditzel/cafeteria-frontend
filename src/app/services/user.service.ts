import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  isActive: boolean;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Este método soluciona el error TS2339
  loginWaiter(username: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login-waiter`, { username });
  }

  getWaiters(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/waiters`);
  }

  saveUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
