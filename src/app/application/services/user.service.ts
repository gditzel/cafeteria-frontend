import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user.model';
import { USER_REPOSITORY, UserRepository } from '../ports/user-repository.port';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  loginWaiter(username: string): Observable<User> {
    return this.userRepository.loginWaiter(username);
  }

  getWaiters(): Observable<User[]> {
    return this.userRepository.getWaiters();
  }

  saveUser(user: User): Observable<User> {
    return this.userRepository.saveUser(user);
  }

  getUserById(id: number): Observable<User> {
    return this.userRepository.getUserById(id);
  }

  deleteUser(id: number): Observable<void> {
    return this.userRepository.deleteUser(id);
  }
}
