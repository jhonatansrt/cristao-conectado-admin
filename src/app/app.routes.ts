import { Routes } from '@angular/router';
import { namedRoutes } from './named-routes';
import { Login } from './presentation/auth/login/login';
import { ChurchPage } from './presentation/church/church';
import { Home } from './presentation/home/home';
import { Members } from './presentation/members/members';
import { Notices } from './presentation/notices/notices';
import { Playlists } from './presentation/playlists/playlists';
import { Schedule } from './presentation/schedule/schedule';
import { Pray } from './presentation/pray/pray';
import { Requests } from './presentation/requests/requests';
import { Testimonials } from './presentation/testimonials/testimonials';
import { Template } from './presentation/template/template';
import { Videos } from './presentation/videos/videos';
import { churchRequiredGuard } from './guards/church-required.guard';
import { loginGuard } from './guards/login.guard';
import { playlistSelectedGuard } from './guards/playlist-selected.guard';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: Template,
    canActivate: [adminGuard, userGuard],
    children: [
      {
        path: '',
        redirectTo: namedRoutes.schedule,
        pathMatch: 'full',
      },
      {
        path: namedRoutes.home,
        component: Home,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.members,
        component: Members,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.schedule,
        component: Schedule,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.playlists,
        component: Playlists,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.notices,
        component: Notices,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.testimonials,
        component: Testimonials,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.church,
        component: ChurchPage,
      },
      {
        path: namedRoutes.pray,
        component: Pray,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.requests,
        component: Requests,
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.videos,
        component: Videos,
        canActivate: [churchRequiredGuard, playlistSelectedGuard],
      },
    ],
  },
  {
    path: namedRoutes.login,
    component: Login,
    canActivate: [loginGuard],
  },
];
