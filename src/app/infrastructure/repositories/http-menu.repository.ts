import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductResponseDTO } from '../../application/dto/product-response.dto';
import { MenuRepository } from '../../application/ports/menu-repository.port';

@Injectable({
  providedIn: 'root'
})
export class HttpMenuRepository implements MenuRepository {
  private apiUrl = 'http://localhost:8080/api/public/menu';

  constructor(private http: HttpClient) {}

  getMenuProducts(): Observable<ProductResponseDTO[]> {
    return this.http.get<ProductResponseDTO[]>(this.apiUrl);
  }
}
