import { Observable } from 'rxjs';
import { GetPlaylistsDTO } from './dto/get-playlists.dto';
import { Playlist } from './entities/playlist.entity';

type CreatePlaylistDTO = {
  churchId: string;
  name: string;
  order: number;
};

type UpdatePlaylistDTO = {
  id: string;
  name: string;
  order: number;
};

export abstract class IPlaylistsRepository {
  abstract getPlaylists(props: GetPlaylistsDTO): Observable<Playlist[]>;
  abstract createPlaylist(props: CreatePlaylistDTO): Observable<Playlist>;
  abstract updatePlaylist(props: UpdatePlaylistDTO): Observable<void>;
  abstract deletePlaylist(props: { id: string }): Observable<void>;
}
