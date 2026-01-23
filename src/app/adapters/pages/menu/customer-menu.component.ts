import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MenuService } from '../../../application/services/menu.service';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-customer-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-menu.component.html'
})
export class CustomerMenuComponent implements OnInit, OnDestroy {
  menuData: any = {};
  categories: string[] = [];
  currentLang: 'es' | 'en' = 'es';
  private stompClient: Client | null = null;

  constructor(
    private menuService: MenuService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMenu();
      this.connectWebSocket();
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient) {
      // Usamos void para ignorar la promesa y evitar el aviso TS80003
      void this.stompClient.deactivate();
    }
  }

  loadMenu(): void {
    this.menuService.getMenuByCategory().subscribe({
      next: (data) => {
        this.menuData = data;
        this.categories = Object.keys(data);
      }
    });
  }

  connectWebSocket(): void {
    // Usamos el endpoint configurado en el backend
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-cafeteria'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Conectado al sistema de stock');
        // Nos suscribimos al canal de actualizaciones definido en OrderService
        this.stompClient?.subscribe('/topic/stock-updates', (message) => {
          const updatedProduct = JSON.parse(message.body);
          this.updateLocalStock(updatedProduct);
        });
      }
    });

    this.stompClient.activate();
  }

  updateLocalStock(updatedProduct: any): void {
    for (const cat of this.categories) {
      const productIndex = this.menuData[cat].findIndex((p: any) => p.id === updatedProduct.id);
      if (productIndex !== -1) {
        // Actualizamos el stock; Angular refrescará la vista automáticamente
        this.menuData[cat][productIndex].stock = updatedProduct.stock;
        break;
      }
    }
  }

  getTranslation(p: any, field: 'name' | 'description'): string {
    const t = p.translations?.find((t: any) => t.languageCode === this.currentLang);
    return t ? t[field] : (p.translations[0] ? p.translations[0][field] : '');
  }

  switchLang(lang: 'es' | 'en'): void { this.currentLang = lang; }
  getProducts(category: string) { return this.menuData[category]; }
}
