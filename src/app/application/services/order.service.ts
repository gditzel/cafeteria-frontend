import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../../domain/models/order.model';
import { ORDER_REPOSITORY, OrderRepository } from '../ports/order-repository.port';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(
    @Inject(ORDER_REPOSITORY) private orderRepository: OrderRepository
  ) {}

  getActiveOrder(tableId: number): Observable<Order> {
    return this.orderRepository.getActiveOrder(tableId);
  }

  createOrder(order: any): Observable<Order> {
    return this.orderRepository.createOrder(order);
  }

  closeOrder(tableId: number): Observable<void> {
    return this.orderRepository.closeOrder(tableId);
  }

  updateStatus(orderId: number, status: string): Observable<void> {
    return this.orderRepository.updateStatus(orderId, status);
  }

  loadPendingOrders(): void {
    this.orderRepository.getPendingOrders().subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }
}
