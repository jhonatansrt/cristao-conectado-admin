import { Routes } from '@angular/router';

import { namedRoutes } from './named-routes';
import { Login } from './presentation/auth/login/login';
import { Church } from './presentation/church/church';
import { Home } from './presentation/home/home';
import { Members } from './presentation/members/members';
import { Notices } from './presentation/notices/notices';
import { Playlists } from './presentation/playlists/playlists';
import { Schedule } from './presentation/schedule/schedule';
import { Template } from './presentation/template/template';

export const routes: Routes = [
  {
    path: '',
    component: Template,
    children: [
      {
        path: '',
        redirectTo: namedRoutes.home,
        pathMatch: 'full',
      },
      {
        path: namedRoutes.home,
        component: Home,
      },
      {
        path: namedRoutes.members,
        component: Members,
      },
      {
        path: namedRoutes.schedule,
        component: Schedule,
      },
      {
        path: namedRoutes.playlists,
        component: Playlists,
      },
      {
        path: namedRoutes.notices,
        component: Notices,
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
