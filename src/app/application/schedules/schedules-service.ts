import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { DaySchedule, ISchedulesRepository, MonthSchedule, ScheduleDetails } from '../../domain/schedules';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { AuthStore } from '../auth/auth-store';
import { SchedulesStore } from './schedules-store';

export type CreateScheduleParams = {
  addressId: string;
  title: string;
  description: string;
  hourInitial: number;
  hourFinal: number;
  day?: number;
  scheduleDate?: string;
};

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  private schedulesRepository = inject(ISchedulesRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private schedulesStore = inject(SchedulesStore);

  public updateSchedule(scheduleId: string, params: CreateScheduleParams): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.schedulesRepository.createSchedule({ ...params, churchId, scheduleId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public createSchedule(params: CreateScheduleParams): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.schedulesRepository.createSchedule({ ...params, churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public getMonthSchedules(month: number, year: number): Observable<MonthSchedule[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.schedulesRepository.getMonthSchedules({ churchId, month, year }).pipe(
      tap((monthSchedules) => {
        this.schedulesStore.setMonthSchedulesByDate(
          new Map(monthSchedules.map((schedule) => [this.parseEndpointDateToKey(schedule.date), schedule.count])),
        );
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public getDaySchedules(date: string, day: 0 | 1 | 2 | 3 | 4 | 5 | 6): Observable<DaySchedule[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.schedulesRepository.getDaySchedules({ churchId, date, day }).pipe(
      tap((daySchedules) => {
        this.schedulesStore.setDaySchedules(daySchedules);
      }),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public getScheduleDetails(id: string): Observable<ScheduleDetails> {
    return this.schedulesRepository.getScheduleDetails(id).pipe(
      tap((details) => this.schedulesStore.setScheduleDetails(id, details)),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteSchedule(id: string): Observable<void> {
    return this.schedulesRepository.deleteSchedule(id).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  private parseEndpointDateToKey(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
