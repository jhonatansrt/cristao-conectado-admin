import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { IMembersRepository, Member } from '../../domain/members';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { UpdateMemberDTO } from '../../domain/members/dto/update-member.dto';

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

  public updateChurchMember(memberData: UpdateMemberDTO): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.membersRepository.updateChurchMember(memberData).pipe(
      map(() => {
        this.toastService.openToast({ success: true, message: 'Atualizado com sucesso' });
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    )
  }
}
