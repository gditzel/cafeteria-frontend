import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from '../../domain/models/table.model';
import { TABLE_REPOSITORY, TableRepository } from '../ports/table-repository.port';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(
    @Inject(TABLE_REPOSITORY) private tableRepository: TableRepository
  ) {}

  getTables(): Observable<Table[]> {
    return this.tableRepository.getTables();
  }
}
