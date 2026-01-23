import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(
    private authService: AuthService
    // Eliminamos 'private router: Router' porque ya no se usa aquí
  ) {}

  onLogin(event: Event): void {
    event.preventDefault();

    const userElement = document.querySelector('input[type="text"]') as HTMLInputElement;

    if (userElement && userElement.value) {
      const username = userElement.value;

      this.authService.login(username).subscribe({
        next: (user) => {
          // La redirección a /cocina o /admin ya la hace el AuthService automáticamente
          console.log('Login exitoso como:', user.role);
        },
        error: () => {
          // Eliminamos el parámetro 'err' que no se usaba para limpiar el warning
          this.errorMessage = 'Usuario no encontrado o inactivo';
        }
      });
    }
  }
}
