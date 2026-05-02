import { Routes } from '@angular/router';

import { namedRoutes } from './named-routes';
import { Login } from './presentation/auth/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: namedRoutes.default,
    pathMatch: 'full',
  },
  {
    path: namedRoutes.login,
    component: Login,
  },
];
