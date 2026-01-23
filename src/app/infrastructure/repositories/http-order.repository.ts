import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../domain/models/order.model';
import { OrderRepository } from '../../application/ports/order-repository.port';

@Injectable({
  providedIn: 'root'
})
export class HttpOrderRepository implements OrderRepository {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getActiveOrder(tableId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/active/${tableId}`);
  }

  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  closeOrder(tableId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/close/${tableId}`, {});
  }

  updateStatus(orderId: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${orderId}/status?status=${status}`, {});
  }

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending`);
  }
}
