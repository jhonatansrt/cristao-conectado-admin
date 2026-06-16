import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { GetMembersPositionResponseDTO, IMembersRepository, Member } from '../../domain/members';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private membersRepository = inject(IMembersRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public getMembersByChurch(): Observable<Member[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.membersRepository.getMembersByChurch({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public getMemberPositions(): Observable<GetMembersPositionResponseDTO[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.membersRepository.getMemberPositions({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
