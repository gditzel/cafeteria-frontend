import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../application/ports/auth-repository.port';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthRepository implements AuthRepository {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username });
  }
}
