import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { IRequestsRepository, UserChurchRequest } from '../../domain/requests';
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
}
