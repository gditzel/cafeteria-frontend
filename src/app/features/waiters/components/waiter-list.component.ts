import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-waiter-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './waiter-list.component.html'
})
export class WaiterListComponent implements OnInit {
  waiters: User[] = [];
  showDeleteModal = false;
  waiterIdToDelete: number | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadWaiters();
  }

  loadWaiters(): void {
    this.userService.getWaiters().subscribe({
      next: (data) => this.waiters = data,
      error: (err) => console.error('Error al cargar mozos:', err)
    });
  }

  openDeleteModal(id: number): void {
    this.waiterIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.waiterIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.waiterIdToDelete) {
      this.userService.deleteUser(this.waiterIdToDelete).subscribe({
        next: () => {
          this.waiters = this.waiters.filter(w => w.id !== this.waiterIdToDelete);
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.closeDeleteModal();
        }
      });
    }
  }

  goToCreate(): void {
    this.router.navigate(['/admin/mozos/nuevo']).then();
  }

  goToEdit(id: number): void {
    // Esta ruta ahora coincide con la definida en app.routes.ts
    this.router.navigate(['/admin/mozos/editar', id]).then();
  }
}
