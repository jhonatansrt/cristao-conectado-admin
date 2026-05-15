import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { PlaylistsService } from '../../application/playlists/playlists-service';
import { finalize } from 'rxjs';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AddPlaylistModal } from './add-playlist-modal/add-playlist-modal';

@Component({
  selector: 'app-playlists',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss',
})
export class Playlists implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private playlistsService = inject(PlaylistsService);
  private readonly headerStore = inject(HeaderStore);
  private readonly container = inject(Container);
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
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar playlist',
        onClick: this.handleAddPlaylist,
      },
    ]);

    this.getPlaylists();
  }

  ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }

  private readonly handleAddPlaylist = (): void => {
    const modalRef = this.container.vcr?.createComponent(AddPlaylistModal);
    modalRef?.instance.playlistCreated.subscribe(() => this.getPlaylists());
  };

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
