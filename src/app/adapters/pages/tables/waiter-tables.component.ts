import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableService } from '../../../application/services/table.service';
import { Table } from '../../../domain/models/table.model';

@Component({
  selector: 'app-waiter-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiter-tables.component.html'
})
export class WaiterTablesComponent implements OnInit {
  tables: Table[] = [];

  constructor(
    private tableService: TableService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tableService.getTables().subscribe({
      next: (data) => {
        // Corregido: Ordenamos las mesas por número antes de asignarlas
        // Esto evita que las mesas ocupadas se muevan al final de la lista
        this.tables = data.sort((a, b) => a.number - b.number);
      },
      error: (err) => console.error('Error al cargar mesas:', err)
    });
  }

  selectMesa(mesa: any) {
    console.log('Navegando a mesa:', mesa.number);
    // Manejo de la promesa de navegación para evitar advertencias de consola
    this.router.navigate(['/mozos/pedido', mesa.id]).then();
  }
}
