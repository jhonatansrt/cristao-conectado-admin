import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, switchMap, catchError, throwError, map } from 'rxjs';
import { IStorageRepository } from '../../domain/storage';
import { IAuthRepository } from '../../domain/auth';
import { AuthStore } from '../../application/auth/auth-store';

export class HttpClientInterceptor implements HttpInterceptor {
  constructor(
    private storage: IStorageRepository,
    private authRepository: IAuthRepository,
    private authStore: AuthStore,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.storage.getStorage('token')).pipe(
      switchMap((authToken) => {
        // Garante que authToken seja uma string válida
        const validToken = authToken ? authToken : '';

        // Adiciona o cabeçalho de autenticação
        request = this.addAuthHeaders(request, validToken);

        return next.handle(request).pipe(
          catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.error.message === 'Invalid token') {
                return this.handleTokenInvalid(request, next);
              }

              if (err.error.message.includes('jwt expired')) {
                // this.toast.openToast({
                //   success: false,
                //   title: 'Atenção',
                //   message: 'Seu token expirou, você precisa logar novamente',
                // });

                // this.sessionStore.logout();

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

  private addAuthHeaders(request: HttpRequest<unknown>, authToken: string): HttpRequest<unknown> {
    // Define os cabeçalhos de acordo com a presença do 'Content-Type'
    const headers: Record<string, string> = !request.headers.has('Content-Type')
      ? { Authorization: `Bearer ${authToken}` }
      : {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        };

    // Clona a requisição e adiciona os cabeçalhos
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
