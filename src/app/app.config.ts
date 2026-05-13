import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { routes } from './app.routes';
import { providers } from './infrastructure/providers';
import { HttpClientInterceptor } from './infrastructure/interceptor/http-client.interceptor';
import { IStorageRepository } from './domain/storage';
import { IAuthRepository } from './domain/auth';
import { AuthStore } from './application/auth/auth-store';

export const appConfig: ApplicationConfig = {
  providers: [
    ...providers,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientInterceptor,
      multi: true,
      deps: [IStorageRepository, IAuthRepository, AuthStore],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
