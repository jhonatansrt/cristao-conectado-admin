import { Observable } from 'rxjs';

type CreateVideoDTO = {
  churchId: string;
  folderId: string;
  youtubeId: string;
  order: number;
  name: string;
  showHome: boolean;
};

type UpdateVideoDTO = {
  id: string;
  folderId: string;
  youtubeId: string;
  order: number;
  name: string;
  showHome: boolean;
};

export abstract class IVideosRepository {
  abstract createVideo(props: CreateVideoDTO): Observable<{ id?: string }>;
  abstract updateVideo(props: UpdateVideoDTO): Observable<void>;
  abstract deleteVideo(props: { id: string }): Observable<void>;
}
