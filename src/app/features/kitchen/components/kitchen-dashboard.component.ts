import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kitchen-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kitchen-dashboard.component.html'
})
export class KitchenDashboardComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  loadingOrderId: number | null = null;
  private orderSubscription: Subscription | undefined;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.loadPendingOrders();

    this.orderSubscription = this.orderService.orders$.subscribe(orders => {
      // Filtramos para asegurar que solo vemos PENDIENTE
      this.pendingOrders = orders.filter(o => o.status === 'PENDIENTE');
    });
  }

  markAsReady(orderId: number | undefined): void {
    if (!orderId) return;
    this.loadingOrderId = orderId;

    this.orderService.updateStatus(orderId, 'LISTO').subscribe({
      next: () => {
        // CORRECCIÓN: Forzamos la recarga de datos para limpiar el Dashboard visualmente
        this.orderService.loadPendingOrders();
        this.loadingOrderId = null;
      },
      error: (err) => {
        console.error('Error al finalizar pedido:', err);
        this.loadingOrderId = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }
}
