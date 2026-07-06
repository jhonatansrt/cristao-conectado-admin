import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';

import { ToastService } from '../../presentation/common/toast/toast.service';
import { IEbdClassRepository } from '../../domain/ebd/ebd-class.repository';
import { EbdClass } from '../../domain/ebd/entities/ebd-class.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdClassService {
  private ebdClassRepository = inject(IEbdClassRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public createEbdClass(props: EbdClass): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.ebdClassRepository
      .postEbdClass({
        church_id: props.church_id,
        name: props.name,
        min_age: props.min_age,
        max_age: props.max_age,
      })
      .pipe(
        map(() => void 0),
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message });
          return throwError(() => e);
        }),
      );
  }
}
