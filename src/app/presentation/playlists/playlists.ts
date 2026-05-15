import { Component, inject, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { PlaylistsService } from '../../application/playlists/playlists-service';
import { finalize } from 'rxjs';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';

@Component({
  selector: 'app-playlists',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss',
})
export class Playlists implements OnInit {
  private readonly tableStore = inject(TableStore<TableRow>);
  private playlistsService = inject(PlaylistsService);
  protected isLoading = this.tableStore.isLoading();

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
    this.getPlaylists();
  }

  private getPlaylists() {
    this.tableStore.setLoading(true);

    this.playlistsService
      .getPlaylists()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((rows) => {
        this.tableStore.setRows(rows);
      });
  }

  protected hasPlaylists(): boolean {
    return this.tableStore.hasRows();
  }
}
