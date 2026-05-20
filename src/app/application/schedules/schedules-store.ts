import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SchedulesStore {
  public readonly monthSchedulesByDate = signal(new Map<string, number>());

  public setMonthSchedulesByDate(monthSchedulesByDate: Map<string, number>): void {
    this.monthSchedulesByDate.set(monthSchedulesByDate);
  }
}
