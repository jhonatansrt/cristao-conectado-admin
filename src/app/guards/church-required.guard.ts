import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../application/auth/auth-store';
import { namedRoutes } from '../named-routes';

export const churchRequiredGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.getUserLogged()()?.church_id) {
    return router.createUrlTree([`/${namedRoutes.church}`]);
  }

  return true;
};
