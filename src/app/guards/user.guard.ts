import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../application/auth/auth-service';
import { AuthStore } from '../application/auth/auth-store';
import { PlaylistSelectedStore } from '../application/playlists/playlist-selected-store';
import { namedRoutes } from '../named-routes';

export const userGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authService.getUserLogged();

  if (!authStore.getUserLogged()()) {
    return router.createUrlTree([`/${namedRoutes.login}`]);
  }

  return true;
};

export const loginGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const router = inject(Router);

  await authService.getUserLogged();

  if (authStore.getUserLogged()()) {
    return router.createUrlTree([`/${namedRoutes.home}`]);
  }

  return true;
};

export const playlistSelectedGuard: CanActivateFn = () => {
  const playlistSelectedStore = inject(PlaylistSelectedStore);
  const router = inject(Router);

  if (!playlistSelectedStore.getPlaylistSelected()().length) {
    return router.createUrlTree([`/${namedRoutes.playlists}`]);
  }

  return true;
};

export const churchRequiredGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.getUserLogged()()?.church_id) {
    return router.createUrlTree([`/${namedRoutes.church}`]);
  }

  return true;
};
