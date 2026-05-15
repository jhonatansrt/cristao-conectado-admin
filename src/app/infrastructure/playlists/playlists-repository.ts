import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetPlaylistsDTO, IPlaylistsRepository, Playlist } from '../../domain/playlists';

@Injectable({
  providedIn: 'root',
})
export class PlaylistsRepository implements IPlaylistsRepository {
  constructor(private httpClient: HttpClient) {}

  public getPlaylists(props: GetPlaylistsDTO): Observable<Playlist[]> {
    const url = environment.apiBaseURL + '/videosFolder/getByChurchId';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
      },
    });

    return this.httpClient.get<Playlist[]>(url, { params });
  }

  public createPlaylist(props: { churchId: string; name: string; order: number }): Observable<Playlist> {
    const url = environment.apiBaseURL + '/videosFolder';

    return this.httpClient.post<Playlist>(url, {
      church_id: props.churchId,
      name: props.name,
      order: props.order,
    });
  }

  public deletePlaylist(props: { id: string }): Observable<void> {
    const url = environment.apiBaseURL + `/videosFolder/${props.id}`;

    return this.httpClient.delete<void>(url);
  }
}

