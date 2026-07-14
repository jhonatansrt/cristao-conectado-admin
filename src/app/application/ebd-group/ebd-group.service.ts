import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';

import { ToastService } from '../../presentation/common/toast/toast.service';
import { IEbdGroupRepository } from '../../domain/ebd/ebd-group.repository';
import { EbdGroup, EbdGroupListItem } from '../../domain/ebd/entities/ebd-group.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdGroupService {
  private ebdGroupRepository = inject(IEbdGroupRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public createEbdGroup(props: Omit<EbdGroup, 'id' | 'church_id'>): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.ebdGroupRepository
      .postEbdGroup({
        church_id: churchId,
        name: props.name,
        type: props.type,
        school_year: props.school_year,
        student_limit: props.student_limit,
        class_id: props.class_id,
        teacher_id: props.teacher_id,
      })
      .pipe(
        map(() => void 0),
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message });
          return throwError(() => e);
        }),
      );
  }

  public putEbdGroup(props: Omit<EbdGroup, 'church_id'>): Observable<void> {
    return this.ebdGroupRepository
      .putEbdGroup(props.id, {
        name: props.name,
        type: props.type,
        school_year: props.school_year,
        student_limit: props.student_limit,
        class_id: props.class_id,
        teacher_id: props.teacher_id,
      })
      .pipe(
        map(() => void 0),
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message });
          return throwError(() => e);
        }),
      );
  }

  public getEbdGroup(): Observable<EbdGroupListItem[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.ebdGroupRepository.getEbdGroup({ church_id: churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message || 'Erro ao carregar turmas' });
        return throwError(() => e);
      }),
    );
  }
}
