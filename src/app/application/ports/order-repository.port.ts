import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../domain/models/order.model';

export interface OrderRepository {
  getActiveOrder(tableId: number): Observable<Order>;
  createOrder(order: any): Observable<Order>;
  closeOrder(tableId: number): Observable<void>;
  updateStatus(orderId: number, status: string): Observable<void>;
  getPendingOrders(): Observable<Order[]>;
}

export const ORDER_REPOSITORY = new InjectionToken<OrderRepository>('ORDER_REPOSITORY');
