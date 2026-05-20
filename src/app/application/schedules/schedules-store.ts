import { Injectable, signal } from '@angular/core';
import { DaySchedule } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesStore {
  public readonly monthSchedulesByDate = signal(new Map<string, number>());
  public readonly daySchedules = signal<DaySchedule[]>([]);

  public setMonthSchedulesByDate(monthSchedulesByDate: Map<string, number>): void {
    this.monthSchedulesByDate.set(monthSchedulesByDate);
  }

  public setDaySchedules(daySchedules: DaySchedule[]): void {
    this.daySchedules.set(daySchedules);
  }
}
