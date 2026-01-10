import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // <--- ESTO ES VITAL
})
export class ProductService {
  private url = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  uploadProduct(product: any, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    formData.append('image', image);
    return this.http.post(this.url, formData);
  }
}
