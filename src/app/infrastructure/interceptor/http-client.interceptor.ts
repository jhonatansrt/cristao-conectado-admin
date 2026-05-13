import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, from, switchMap, catchError, throwError, map } from 'rxjs';
import { AuthStore } from '../../application/auth/auth-store';
import { IAuthRepository } from '../../domain/auth';
import { IStorageRepository } from '../../domain/storage';

export class HttpClientInterceptor implements HttpInterceptor {
  constructor(
    private storage: IStorageRepository,
    private authRepository: IAuthRepository,
    private authStore: AuthStore,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return from(this.storage.getStorage('token')).pipe(
      switchMap((authToken) => {
        const validToken = authToken ? authToken : '';
        request = this.addAuthHeaders(request, validToken);

        return next.handle(request).pipe(
          catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.error.message === 'Invalid token') {
                return this.handleTokenInvalid(request, next);
              }

              if (err.error.message.includes('jwt expired')) {
                return throwError(() => err);
              }
            }

            return throwError(() => err);
          }),
          map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
            return evt;
          }),
        );
      }),
    );
  }

  private addAuthHeaders(
    request: HttpRequest<unknown>,
    authToken: string,
  ): HttpRequest<unknown> {
    const headers: Record<string, string> = !request.headers.has('Content-Type')
      ? { Authorization: `Bearer ${authToken}` }
      : {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        };

    return request.clone({ setHeaders: headers });
  }

  private handleTokenInvalid(request: HttpRequest<any>, next: HttpHandler) {
    return from(this.storage.getStorage('refreshToken')).pipe(
      switchMap((token) => {
        return this.authRepository.refreshToken({ token: token ?? '' }).pipe(
          switchMap((resp: any) => {
            const token = resp.token;
            const refreshToken = resp.refresh_token;
            this.storage.setStorage('token', token);
            this.storage.setStorage('refreshToken', refreshToken);

            request = this.addAuthHeaders(request, token);

            return next.handle(request.clone());
          }),
        );
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
