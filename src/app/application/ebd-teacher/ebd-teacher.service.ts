import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';

import { ToastService } from '../../presentation/common/toast/toast.service';
import { IEbdTeacherRepository } from '../../domain/ebd/ebd-teacher.repository';
import { CreateEbdTeacherResponseDTO } from '../../domain/ebd/dto/create-ebd-teacher-response.dto';
import { EbdTeacher } from '../../domain/ebd/entities/ebd-teacher.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdTeacherService {
  private ebdTeacherRepository = inject(IEbdTeacherRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public createEbdTeacher(memberId: string): Observable<CreateEbdTeacherResponseDTO | void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.ebdTeacherRepository
      .postEbdTeacher({ church_id: churchId, member_id: memberId })
      .pipe(
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message });
          return throwError(() => e);
        }),
      );
  }

  public getEbdTeacher(): Observable<EbdTeacher[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.ebdTeacherRepository.getEbdTeacher({ church_id: churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message || 'Erro ao carregar professores' });
        return throwError(() => e);
      }),
    );
  }
}
