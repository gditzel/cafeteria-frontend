import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  showLogoutModal = false;
  userRole: string = '';
  private authSubscription!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Escucha el rol del usuario para actualizar el menú en tiempo real
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || '';
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  openLogoutModal() { this.showLogoutModal = true; }
  cancelLogout() { this.showLogoutModal = false; }
  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
  }
}
