import { Routes } from '@angular/router';
import { namedRoutes } from './named-routes';
import { churchRequiredGuard } from './guards/church-required.guard';
import { loginGuard } from './guards/login.guard';
import { playlistSelectedGuard } from './guards/playlist-selected.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/template/template').then(m => m.Template),
    canActivate: [userGuard],
    children: [
      {
        path: '',
        redirectTo: namedRoutes.schedule,
        pathMatch: 'full',
      },
      {
        path: namedRoutes.home,
        loadComponent: () => import('./presentation/home/home').then(m => m.Home),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.members,
        loadComponent: () => import('./presentation/members/members').then(m => m.Members),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.schedule,
        loadComponent: () => import('./presentation/schedule/schedule').then(m => m.Schedule),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.playlists,
        loadComponent: () => import('./presentation/playlists/playlists').then(m => m.Playlists),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.notices,
        loadComponent: () => import('./presentation/notices/notices').then(m => m.Notices),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.testimonials,
        loadComponent: () => import('./presentation/testimonials/testimonials').then(m => m.Testimonials),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.church,
        loadComponent: () => import('./presentation/church/church').then(m => m.ChurchPage),
      },
      {
        path: namedRoutes.pray,
        loadComponent: () => import('./presentation/pray/pray').then(m => m.Pray),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.requests,
        loadComponent: () => import('./presentation/requests/requests').then(m => m.Requests),
        canActivate: [churchRequiredGuard],
      },
      {
        path: namedRoutes.videos,
        loadComponent: () => import('./presentation/videos/videos').then(m => m.Videos),
        canActivate: [churchRequiredGuard, playlistSelectedGuard],
      },
    ],
  },
  {
    path: namedRoutes.login,
    loadComponent: () => import('./presentation/auth/login/login').then(m => m.Login),
    canActivate: [loginGuard],
  },
  {
    path: namedRoutes.privacyPolicy,
    loadComponent: () => import('./presentation/privacy-policy-page/privacy-policy-page').then(m => m.PrivacyPolicyPage),
  },
];
