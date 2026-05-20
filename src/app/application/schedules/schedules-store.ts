import { Injectable, signal } from '@angular/core';
import { DaySchedule } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesStore {
  public readonly monthSchedulesByDate = signal(new Map<string, number>());
  public readonly daySchedules = signal<DaySchedule[]>([]);
  public readonly isLoadingCalendar = signal(true);
  public readonly currentMonth = signal(new Date().getMonth() + 1);
  public readonly currentYear = signal(new Date().getFullYear());
  public readonly selectedDate = signal<{ iso: string; weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 } | null>(null);

  public setMonthSchedulesByDate(monthSchedulesByDate: Map<string, number>): void {
    this.monthSchedulesByDate.set(monthSchedulesByDate);
  }

  public setDaySchedules(daySchedules: DaySchedule[]): void {
    this.daySchedules.set(daySchedules);
  }

  public setIsLoadingCalendar(isLoading: boolean): void {
    this.isLoadingCalendar.set(isLoading);
  }

  public setCurrentMonthAndYear(month: number, year: number): void {
    this.currentMonth.set(month);
    this.currentYear.set(year);
  }

  public setSelectedDate(selectedDate: { iso: string; weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 } | null): void {
    this.selectedDate.set(selectedDate);
  }
}
