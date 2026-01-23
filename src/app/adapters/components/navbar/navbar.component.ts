import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../../application/services/category.service';
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
  categories: any[] = [];
  isDropdownOpen = false; // Control del click
  private authSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || '';
      if (this.userRole === 'ADMIN') this.loadCategories();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories = data);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Evita que el click se propague
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Cierra el menú al elegir una categoría
  selectCategory(catName?: string) {
    this.isDropdownOpen = false;
    if (catName) {
      this.router.navigate(['/admin/productos/categoria', catName]);
    } else {
      this.router.navigate(['/admin/productos']);
    }
  }

  // Cierra el menú si se hace click fuera del navbar
  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
  }

  openLogoutModal() { this.showLogoutModal = true; }
  cancelLogout() { this.showLogoutModal = false; }
  confirmLogout() {
    this.showLogoutModal = false;
    this.authService.logout();
  }
}
