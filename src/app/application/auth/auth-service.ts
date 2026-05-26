import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

import { AuthStore } from './auth-store';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { IStorageRepository } from '../../domain/storage';
import {
  CreateAccountDTO,
  CreateSessionApiResponse,
  CreateSessionDTO,
  ForgotPasswordDTO,
  IAuthRepository,
  ResetPasswordDTO,
  UpdateAvatarApiResponse,
  UpdateAvatarDTO,
  UpdatePasswordDTO,
  UpdateUserDTO,
  User,
} from '../../domain/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storage = inject(IStorageRepository);
  private authRepository = inject(IAuthRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public createSession(props: CreateSessionDTO): Observable<CreateSessionApiResponse> {
    return this.authRepository.createSession(props).pipe(
      tap((resp) => {
        this.storage.setStorage('token', resp.token);
        this.storage.setStorage('refreshToken', resp.refresh_token);
        this.storage.setStorage('userLogged', resp.user);
        this.getUserLogged();
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public createAccount(props: CreateAccountDTO): Observable<void> {
    return this.authRepository.createAccount(props).pipe(
      switchMap(() => {
        return this.createSession(props);
      }),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public async getUserLogged() {
    const userLogged = await this.storage.getStorage('userLogged');

    if (userLogged) {
      this.authStore.setUserLogged(userLogged);
    }
  }

  public async logout(): Promise<void> {
    await this.storage.clearAll();
    this.authStore.clear();
    await this.router.navigate(['/login']);
  }

  public updatePassword(props: UpdatePasswordDTO): Observable<void> {
    return this.authRepository.updatePassword(props).pipe(
      tap(() => this.toastService.openToast({ success: true })),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateAvatar(props: UpdateAvatarDTO): Observable<UpdateAvatarApiResponse> {
    return this.authRepository.updateAvatar(props).pipe(
      tap(async (resp) => {
        const userLogged = await this.storage.getStorage('userLogged');

        if (!userLogged) {
          return;
        }

        const updatedUser: User = { ...userLogged, avatar: resp.avatar };

        await this.storage.setStorage('userLogged', updatedUser);
        this.authStore.setUserLogged(updatedUser);
        this.toastService.openToast({ success: true });
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateUser(props: UpdateUserDTO): Observable<void> {
    return this.authRepository.updateUser(props).pipe(
      tap(async () => {
        const userLogged = await this.storage.getStorage('userLogged');

        if (!userLogged) {
          return;
        }

        const updatedUser: User = {
          ...userLogged,
          name: props.name,
          birth_date: props.birth_date,
        };

        this.authStore.setUserLogged(updatedUser);
        this.toastService.openToast({ success: true });
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public forgotPassword(props: ForgotPasswordDTO): Observable<void> {
    return this.authRepository.forgotPassword(props).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public resetPassword(props: ResetPasswordDTO): Observable<void> {
    return this.authRepository.resetPassword(props).pipe(
      tap(() =>
        this.toastService.openToast({
          success: true,
          message: 'Sua senha foi redefinida com sucesso',
        }),
      ),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
