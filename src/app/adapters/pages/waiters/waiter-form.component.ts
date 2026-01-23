import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../application/services/user.service';
import { User } from '../../../domain/models/user.model';

@Component({
  selector: 'app-waiter-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './waiter-form.component.html'
})
export class WaiterFormComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    isActive: true,
    role: 'WAITER'
  };
  isEdit = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.userService.getUserById(+id).subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err: any) => {
          console.error('Error al cargar mozo:', err);
          this.router.navigate(['/admin/mozos']).then();
        }
      });
    }
  }

  onSubmit(): void {
    this.userService.saveUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/admin/mozos']).then();
      },
      error: (err: any) => console.error('Error al guardar mozo:', err)
    });
  }
}
