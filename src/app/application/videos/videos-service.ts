import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IVideosRepository } from '../../domain/videos';
import { environment } from '../../../environments/environment';
import { AuthStore } from '../auth/auth-store';
import { PlaylistSelectedStore } from '../playlists/playlist-selected-store';
import { TableRow } from '../table/table-store';

type VideoResponse = {
  id?: string;
  name?: string;
  youtube_id?: string;
  show_home?: boolean;
  order?: number;
};

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private readonly httpClient = inject(HttpClient);
  private readonly authStore = inject(AuthStore);
  private readonly playlistSelectedStore = inject(PlaylistSelectedStore);
  private readonly videosRepository = inject(IVideosRepository);

  public getVideos(): Observable<TableRow[]> {
    const folderId = this.playlistSelectedStore.getPlaylistSelected()()[0]?.id;

    if (!folderId) {
      return of([]);
    }

    const url = environment.apiBaseURL + '/videos/getByFolderId';
    const params = new HttpParams({
      fromObject: {
        folder_id: folderId,
      },
    });

    return this.httpClient.get<VideoResponse[]>(url, { params }).pipe(
      map((videos) =>
        videos.map((video, index) => ({
          id: video.id ?? `${index + 1}`,
          title: video.name ?? '-',
          videoId: video.youtube_id ?? '-',
          featured: video.show_home ? 'Sim' : 'Não',
          order: video.order ?? index + 1,
          actions: [
            { key: `edit-${index}`, icon: 'edit', label: 'Editar vídeo' },
            { key: `delete-${index}`, icon: 'delete', label: 'Excluir vídeo' },
            { key: `open-${index}`, icon: 'chevron_right', label: 'Abrir vídeo' },
          ],
        })),
      ),
    );
  }

  public createVideo(props: { youtubeId: string; name: string; order: number; showHome: boolean }): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    const folderId = this.playlistSelectedStore.getPlaylistSelected()()[0]?.id;

    if (!churchId || !folderId) {
      return of(void 0);
    }

    return this.videosRepository
      .createVideo({
        churchId,
        folderId,
        youtubeId: props.youtubeId,
        order: props.order,
        name: props.name,
        showHome: props.showHome,
      })
      .pipe(map(() => void 0));
  }

  public deleteVideo(props: { id: string }): Observable<void> {
    return this.videosRepository.deleteVideo({ id: props.id });
  }
}
