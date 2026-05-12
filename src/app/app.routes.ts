import { Routes } from '@angular/router';

import { namedRoutes } from './named-routes';
import { Login } from './presentation/auth/login/login';
import { Church } from './presentation/church/church';
import { Template } from './presentation/template/template';

export const routes: Routes = [
  {
    path: '',
    component: Template,
    children: [
      {
        path: '',
        redirectTo: namedRoutes.church,
        pathMatch: 'full',
      },
      {
        path: namedRoutes.church,
        component: Church,
      },
    ],
  },
  {
    path: namedRoutes.login,
    component: Login,
  },
];
