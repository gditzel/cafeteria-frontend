import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Order {
  id?: number;
  table: { id: number; number?: number };
  status: string;
  items: any[];
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Recupera el consumo acumulado de la mesa (MÉTODO QUE FALTABA)
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

  loadPendingOrders(): void {
    this.http.get<Order[]>(`${this.apiUrl}/pending`).subscribe(orders => {
      this.ordersSubject.next(orders);
    });
  }
}
