import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
  });

  onSubmit(): void {
    this.errorMessage = '';
    if (this.form.invalid) return;

    this.loading = true;
    const username = this.form.controls.username.value.trim();
    this.auth.login(username).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'Usuario no encontrado.';
        } else if (err.status === 401) {
          this.errorMessage = 'Usuario inactivo.';
        } else {
          this.errorMessage =
            'No se pudo iniciar sesión. ¿Está el backend en http://localhost:8080?';
        }
      },
    });
  }
}
