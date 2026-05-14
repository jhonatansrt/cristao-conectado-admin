import { Observable } from 'rxjs';
import { GetPlaylistsDTO } from './dto/get-playlists.dto';
import { Playlist } from './entities/playlist.entity';

export abstract class IPlaylistsRepository {
  abstract getPlaylists(props: GetPlaylistsDTO): Observable<Playlist[]>;
}
