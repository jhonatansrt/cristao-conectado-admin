import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { PlaylistsService } from '../../application/playlists/playlists-service';
import { finalize } from 'rxjs';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Container } from '../../util/container.service';
import { AlertService } from '../common/alert/alert.service';
import { AddPlaylistModal, PlaylistFormData } from './add-playlist-modal/add-playlist-modal';
import { PlaylistSelectedStore } from '../../application/playlists/playlist-selected-store';
import { namedRoutes } from '../../named-routes';
import { Playlist } from '../../domain/playlists/entities/playlist.entity';

@Component({
  selector: 'app-playlists',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './playlists.html',
  styleUrl: './playlists.scss',
})
export class Playlists implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly playlistsService = inject(PlaylistsService);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  private readonly navController = inject(Router);
  private readonly playlistSelectedStore = inject(PlaylistSelectedStore);
  protected isLoading = this.tableStore.isLoading();
  private maxOrder = 1;

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
    this.setButtonsActions();
    this.getPlaylists();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar playlist',
        onClick: this.handleAddPlaylist,
      },
    ]);
  }

  private readonly handleAddPlaylist = (): void => {
    const modalRef = this.container.vcr?.createComponent(AddPlaylistModal);
    modalRef?.setInput('maxOrder', this.maxOrder);
    modalRef?.instance.playlistCreated.subscribe(() => this.getPlaylists());
  };

  private handleEditPlaylist(playlistData: PlaylistFormData): void {
    const modalRef = this.container.vcr?.createComponent(AddPlaylistModal);
    if (modalRef) {
      modalRef.setInput('maxOrder', this.maxOrder);
      modalRef.instance.playlistData = playlistData;
      modalRef.instance.playlistCreated.subscribe(() => this.getPlaylists());
    }
  }

  private getPlaylists() {
    this.tableStore.setLoading(true);

    this.playlistsService
      .getPlaylists()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe({
        next: (rows) => {
          this.tableStore.setRows(
            rows.map((row) => ({
              ...row,
              actions: row.actions?.map((action) => {
                if (action.key === 'edit') {
                  return {
                    ...action,
                    onClick: () =>
                      this.handleEditPlaylist({
                        id: String(row.id),
                        name: String(row['title'] ?? ''),
                        order: Number(row['order'] ?? 1),
                      }),
                  };
                }

                if (action.key === 'delete') {
                  return {
                    ...action,
                    onClick: () => this.handleDeletePlaylist(String(row.id)),
                  };
                }

                if (action.key === 'open') {
                  return {
                    ...action,
                    onClick: () =>
                      this.handleOpenPlaylist({
                        id: String(row.id),
                        church_id: '',
                        order: Number(row['order'] ?? 0),
                        name: String(row['title'] ?? ''),
                        created_at: '',
                        updated_at: '',
                        videoCount: Number(String(row['videos'] ?? '0').split(' ')[0]) || 0,
                      }),
                  };
                }

                return action;
              }),
            })),
          );

          this.maxOrder = rows.length + 1;
        },
        error: () => {},
      });
  }

  private async handleDeletePlaylist(playlistId: string): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir a playlist?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    this.playlistsService
      .deletePlaylist({ id: playlistId })
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe({
        next: () => this.getPlaylists(),
        error: () => {},
      });
  }

  private handleOpenPlaylist(playlist: Playlist): void {
    this.playlistSelectedStore.setPlaylistSelected(playlist);
    void this.navController.navigate([namedRoutes.videos]);
  }

  protected hasPlaylists(): boolean {
    return this.tableStore.hasRows();
  }
}
