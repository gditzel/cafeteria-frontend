import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from '../../domain/models/table.model';
import { TableRepository } from '../../application/ports/table-repository.port';

@Injectable({
  providedIn: 'root'
})
export class HttpTableRepository implements TableRepository {
  private apiUrl = 'http://localhost:8080/api/tables';

  constructor(private http: HttpClient) {}

  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }
}
