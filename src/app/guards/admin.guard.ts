import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStore } from '../application/auth/auth-store';
import { TypeUser } from '../domain/auth/enums/type-user.enum';
import { namedRoutes } from '../named-routes';

export const adminGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.getUserLogged()();
  const allowedRoles = [TypeUser.MASTER, TypeUser.ADMIN];

  if (!user || !allowedRoles.includes(user.type)) {
    return router.createUrlTree([`/${namedRoutes.home}`]);
  }

  return true;
};
