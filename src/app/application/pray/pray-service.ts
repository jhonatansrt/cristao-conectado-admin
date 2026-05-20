import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { TableRow } from '../table/table-store';
import { AuthStore } from '../auth/auth-store';
import { IPrayRepository } from '../../domain/pray';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';

@Injectable({
  providedIn: 'root',
})
export class PrayService {
  private prayRepository = inject(IPrayRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private capitalizeNamePipe = new CapitalizeNamePipe();

  public getPray(): Observable<TableRow[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.prayRepository.getPray({ churchId }).pipe(
      map((prayers) => {
        return prayers.map((pray) => ({
          id: pray.id,
          userName: this.capitalizeNamePipe.transform(pray.__user__?.name ?? pray.user?.name),
          title: pray.title,
          description: pray.description,
          actions: [{ key: 'delete', icon: 'delete', label: 'Excluir pedido de oração' }],
        }));
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }


  public deletePray(id: string): Observable<void> {
    return this.prayRepository.deletePray(id).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public createPray(props: { id?: string; title: string; description: string }): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.prayRepository
      .createPray({
        id: props.id,
        churchId,
        type: 2,
        title: props.title,
        description: props.description,
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
