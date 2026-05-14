import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { ISchedulesRepository, MonthSchedule } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  private schedulesRepository = inject(ISchedulesRepository);
  private authStore = inject(AuthStore);

  public getMonthSchedules(month: number, year: number): Observable<MonthSchedule[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.schedulesRepository.getMonthSchedules({ churchId, month, year });
  }
}
