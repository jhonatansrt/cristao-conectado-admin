import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../application/auth/auth-service';
import { AuthStore } from '../application/auth/auth-store';
import { ChurchStore } from '../application/church/church-store';
import { TypeUser } from '../domain/auth/enums/type-user.enum';
import { namedRoutes } from '../named-routes';

export const userGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const churchStore = inject(ChurchStore);
  const router = inject(Router);

  await authService.getUserLogged();

  const user = authStore.getUserLogged()();

  if (!user) {
    return router.createUrlTree([`/${namedRoutes.login}`]);
  }

  const allowedRoles = [TypeUser.MASTER];
  if (!allowedRoles.includes(user.type)) {
    return router.createUrlTree([`/${namedRoutes.login}`]);
  }

  if (user.church_id) {
    await churchStore.loadChurchFromStorage();
  }

  return true;
};
