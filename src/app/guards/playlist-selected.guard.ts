import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PlaylistSelectedStore } from '../application/playlists/playlist-selected-store';
import { namedRoutes } from '../named-routes';

export const playlistSelectedGuard: CanActivateFn = () => {
  const playlistSelectedStore = inject(PlaylistSelectedStore);
  const router = inject(Router);

  if (!playlistSelectedStore.getPlaylistSelected()().length) {
    return router.createUrlTree([`/${namedRoutes.playlists}`]);
  }

  return true;
};
