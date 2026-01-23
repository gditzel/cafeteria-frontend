import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user.model';

export interface UserRepository {
  loginWaiter(username: string): Observable<User>;
  getWaiters(): Observable<User[]>;
  saveUser(user: User): Observable<User>;
  getUserById(id: number): Observable<User>;
  deleteUser(id: number): Observable<void>;
}

export const USER_REPOSITORY = new InjectionToken<UserRepository>('USER_REPOSITORY');
