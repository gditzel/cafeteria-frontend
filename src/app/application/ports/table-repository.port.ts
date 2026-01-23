import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from '../../domain/models/table.model';

export interface TableRepository {
  getTables(): Observable<Table[]>;
}

export const TABLE_REPOSITORY = new InjectionToken<TableRepository>('TABLE_REPOSITORY');
