import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { TableRow } from '../table/table-store';
import { IPlaylistsRepository } from '../../domain/playlists';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class PlaylistsService {
  private playlistsRepository = inject(IPlaylistsRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

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
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
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
    }).pipe(
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updatePlaylist(props: { id: string; name: string; order: number }): Observable<void> {
    return this.playlistsRepository.updatePlaylist(props).pipe(
      tap(() => this.toastService.openToast({ success: true, message: 'Atualizado com sucesso' })),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deletePlaylist(props: { id: string }): Observable<void> {
    return this.playlistsRepository.deletePlaylist({ id: props.id }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  private formatDate(date: string): string {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }
}
