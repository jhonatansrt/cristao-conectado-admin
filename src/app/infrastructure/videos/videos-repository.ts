import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IVideosRepository } from '../../domain/videos';

@Injectable({
  providedIn: 'root',
})
export class VideosRepository implements IVideosRepository {
  constructor(private httpClient: HttpClient) {}

  public createVideo(props: {
    churchId: string;
    folderId: string;
    youtubeId: string;
    order: number;
    name: string;
    showHome: boolean;
  }): Observable<{ id?: string }> {
    const url = environment.apiBaseURL + '/videos';

    return this.httpClient.post<{ id?: string }>(url, {
      church_id: props.churchId,
      folder_id: props.folderId,
      youtube_id: props.youtubeId,
      order: String(props.order),
      name: props.name,
      show_home: props.showHome,
    });
  }

  public deleteVideo(props: { id: string }): Observable<void> {
    const url = environment.apiBaseURL + `/video/${props.id}`;

    return this.httpClient.delete<void>(url);
  }
}
