import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-waiter-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waiter-login.component.html'
})
export class WaiterLoginComponent {
  username: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onLogin(): void {
    if (!this.username) return;

    this.userService.loginWaiter(this.username).subscribe({
      next: (user) => {
        // Guardamos al mozo para usar su ID en los futuros pedidos
        localStorage.setItem('currentWaiter', JSON.stringify(user));
        this.router.navigate(['/mozos/mesas']).then(); // Siguiente paso: Selección de mesas
      },
      error: () => {
        this.errorMessage = 'Usuario inválido o cuenta inactiva';
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }
}
