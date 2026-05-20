import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-members',
  imports: [TableComponent],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  private readonly tableStore = inject(TableStore<TableRow>);

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
      { key: 'birthDate', header: 'Data de nascimento' },
    ];

    const rows: TableRow[] = [
      {
        id: 1,
        name: 'Ana Souza',
        email: 'ana.souza@email.com',
        birthDate: '14/03/1992',
      },
      {
        id: 2,
        name: 'Carlos Lima',
        email: 'carlos.lima@email.com',
        birthDate: '27/08/1988',
      },
      {
        id: 3,
        name: 'Mariana Alves',
        email: 'mariana.alves@email.com',
        birthDate: '05/11/1995',
      },
    ];

    this.tableStore.setTable(columns, rows);
  }
}
