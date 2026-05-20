import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { TableRow } from '../table/table-store';
import { AuthStore } from '../auth/auth-store';
import { INoticesRepository } from '../../domain/notices';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class NoticesService {
  private noticesRepository = inject(INoticesRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public getNotices(): Observable<TableRow[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.noticesRepository.getNotices({ churchId }).pipe(
      map((notices) => {
        return notices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          description: notice.description,
          actions: [
            { key: 'edit', icon: 'edit', label: 'Editar aviso' },
            { key: 'delete', icon: 'delete', label: 'Excluir aviso' },
          ],
        }));
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteNotice(id: string): Observable<void> {
    return this.noticesRepository.deleteNotice(id).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public createNotice(props: { id?: string; title: string; description: string }): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.noticesRepository
      .createNotice({
        id: props.id,
        churchId,
        type: 0,
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
