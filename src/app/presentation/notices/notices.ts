import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-notices',
  imports: [TableComponent],
  templateUrl: './notices.html',
  styleUrl: './notices.scss',
})
export class Notices {
  private readonly tableStore = inject(TableStore<TableRow>);

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
      { key: 'targetAudience', header: 'Público alvo' },
      { key: 'expiresAt', header: 'Válido até' },
      { key: 'status', header: 'Status' },
    ];

    const rows: TableRow[] = [
      { id: 1, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 2, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Louvor', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 3, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Pastores', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 4, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 5, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 6, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Expirado' },
      { id: 7, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Ativo' },
      { id: 8, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Expirado' },
      { id: 9, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Expirado' },
      { id: 10, title: 'Culto', description: 'O culto começara mais cedo na quinta-feira por conta da ceia', targetAudience: 'Todos os membros', expiresAt: '22/10/1970', status: 'Ativo' },
    ].map((row) => ({
      ...row,
      actions: [
        { key: 'edit', icon: 'edit', label: 'Editar aviso' },
        { key: 'delete', icon: 'delete', label: 'Excluir aviso' },
      ],
    }));

    this.tableStore.setTable(columns, rows);
  }
}
