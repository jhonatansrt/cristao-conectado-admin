import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-playlists',
  imports: [TableComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss',
})
export class Playlists {
  private readonly tableStore = inject(TableStore<TableRow>);


  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'videos', header: 'Quantidade de vídeos' },
      { key: 'createdAt', header: 'Data de criação' },
      { key: 'updatedAt', header: 'Última atualização' },
      { key: 'order', header: 'Ordem de exibição' },
    ];

    const rows: TableRow[] = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: 'Pregações',
      videos: '3 vídeos',
      createdAt: '22/10/1970',
      updatedAt: '22/10/1970',
      order: index + 1,
      actions: [
        { key: 'edit', icon: 'edit', label: 'Editar playlist' },
        { key: 'delete', icon: 'delete', label: 'Excluir playlist' },
        { key: 'open', icon: 'chevron_right', label: 'Abrir playlist' },
      ],
    }));

    this.tableStore.setTable(columns, rows);
  }
}
