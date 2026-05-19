import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { DaySchedule, ISchedulesRepository, MonthSchedule, ScheduleDetails } from '../../domain/schedules';

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

  public createSchedule(params: CreateScheduleParams): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.schedulesRepository.createSchedule({ ...params, churchId });
  }

  public getMonthSchedules(month: number, year: number): Observable<MonthSchedule[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.schedulesRepository.getMonthSchedules({ churchId, month, year });
  }

  public getDaySchedules(date: string, day: 0 | 1 | 2 | 3 | 4 | 5 | 6): Observable<DaySchedule[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.schedulesRepository.getDaySchedules({ churchId, date, day });
  }

  public getScheduleDetails(id: string): Observable<ScheduleDetails> {
    return this.schedulesRepository.getScheduleDetails(id);
  }
}
