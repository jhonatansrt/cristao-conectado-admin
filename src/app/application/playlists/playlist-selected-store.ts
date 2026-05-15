import { Injectable, Signal, signal } from '@angular/core';
import { Playlist } from '../../domain/playlists/entities/playlist.entity';

@Injectable({
  providedIn: 'root',
})
export class PlaylistSelectedStore {
  private readonly playlistSelected = signal<Playlist[]>([]);

  public setPlaylistSelected(playlist: Playlist): void {
    this.playlistSelected.set([playlist]);
  }

  public clearPlaylistSelected(): void {
    this.playlistSelected.set([]);
  }

  public getPlaylistSelected(): Signal<Playlist[]> {
    return this.playlistSelected;
  }
}
