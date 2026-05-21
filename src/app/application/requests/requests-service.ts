import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { IRequestsRepository, ReviewUserChurchRequestDTO, UserChurchRequest } from '../../domain/requests';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private requestsRepository = inject(IRequestsRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public getPendingRequestsByChurch(): Observable<UserChurchRequest[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.requestsRepository.getPendingRequestsByChurch({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public reviewRequest(props: ReviewUserChurchRequestDTO, requestName?: string): Observable<unknown> {
    return this.requestsRepository.reviewUserChurchRequest(props).pipe(
      tap(() => {
        if (!requestName) {
          return;
        }

        if (props.status === 1) {
          this.toastService.openToast({
            message: `${requestName} foi aprovado(a) com sucesso.`,
            success: true,
          });
          return;
        }

        if (props.status === 2) {
          this.toastService.openToast({
            message: `Solicitação de ${requestName} negada.`,
            success: true,
          });
        }
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
