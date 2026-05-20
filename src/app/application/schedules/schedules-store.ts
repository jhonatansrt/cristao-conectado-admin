import { Injectable, Signal, signal } from '@angular/core';
import { DaySchedule } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesStore {
  private readonly monthSchedulesByDate = signal(new Map<string, number>());
  private readonly daySchedules = signal<DaySchedule[]>([]);
  private readonly isLoadingCalendar = signal(true);
  private readonly currentMonth = signal(new Date().getMonth() + 1);
  private readonly currentYear = signal(new Date().getFullYear());
  private readonly selectedDate = signal<{ iso: string; weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 } | null>(null);



  public getMonthSchedulesByDate(): Signal<Map<string, number>> {
    return this.monthSchedulesByDate;
  }

  public getDaySchedules(): Signal<DaySchedule[]> {
    return this.daySchedules;
  }

  public getIsLoadingCalendar(): Signal<boolean> {
    return this.isLoadingCalendar;
  }

  public getCurrentMonth(): Signal<number> {
    return this.currentMonth;
  }

  public getCurrentYear(): Signal<number> {
    return this.currentYear;
  }

  public getSelectedDate(): Signal<{ iso: string; weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 } | null> {
    return this.selectedDate;
  }

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
