import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { TableRow } from '../table/table-store';
import { AuthStore } from '../auth/auth-store';
import { ITestimonialsRepository } from '../../domain/testimonials';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsService {
  private testimonialsRepository = inject(ITestimonialsRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public getTestimonials(): Observable<TableRow[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.testimonialsRepository.getTestimonials({ churchId }).pipe(
      map((testimonials) => {
        return testimonials.map((testimonial) => ({
          id: testimonial.id,
          title: testimonial.title,
          description: testimonial.description,
          userName: testimonial.user?.name ?? '-',
          actions: [{ key: 'delete', icon: 'delete', label: 'Excluir testemunho' }],
        }));
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteTestimonial(id: string): Observable<void> {
    return this.testimonialsRepository.deleteTestimonial(id).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public createTestimonial(props: { title: string; description: string }): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.testimonialsRepository
      .createTestimonial({
        churchId,
        type: 1,
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
