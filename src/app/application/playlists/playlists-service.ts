import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { TableRow } from '../table/table-store';
import { IPlaylistsRepository } from '../../domain/playlists';

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  private playlistsRepository = inject(IPlaylistsRepository);
  private authStore = inject(AuthStore);

  public getPlaylists(): Observable<TableRow[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.playlistsRepository.getPlaylists({ churchId }).pipe(
      map((playlists) =>
        playlists.map((playlist) => ({
          id: playlist.id,
          title: playlist.name,
          videos: `${playlist.videoCount} vídeo${playlist.videoCount === 1 ? '' : 's'}`,
          createdAt: this.formatDate(playlist.created_at),
          updatedAt: this.formatDate(playlist.updated_at),
          order: playlist.order,
          actions: [
            { key: 'edit', icon: 'edit', label: 'Editar playlist' },
            { key: 'delete', icon: 'delete', label: 'Excluir playlist' },
            { key: 'open', icon: 'chevron_right', label: 'Abrir playlist' },
          ],
        })),
      ),
    );
  }

  public createPlaylist(props: { name: string; order: number }): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.playlistsRepository.createPlaylist({
      churchId,
      name: props.name,
      order: props.order,
    }).pipe(map(() => void 0));
  }

  private formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }
}
