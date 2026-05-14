import { Component, inject, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { PlaylistsService } from '../../application/playlists/playlists-service';

@Component({
  selector: 'app-playlists',
  imports: [TableComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss',
})
export class Playlists implements OnInit {
  private readonly tableStore = inject(TableStore<TableRow>);
  private playlistsService = inject(PlaylistsService);

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'videos', header: 'Quantidade de vídeos' },
      { key: 'createdAt', header: 'Data de criação' },
      { key: 'updatedAt', header: 'Última atualização' },
      { key: 'order', header: 'Ordem de exibição' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.playlistsService.getPlaylists().subscribe((rows) => {
      this.tableStore.setRows(rows);
    });
  }

}
