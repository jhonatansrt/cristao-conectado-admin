import { Injectable, Signal, signal } from '@angular/core';

export type NativeCalendarSelectedDate = {
  iso: string;
  weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

@Injectable({
  providedIn: 'root',
})
export class NativeCalendarStore {
  private readonly isLoading = signal(true);
  private readonly countsByDate = signal(new Map<string, number>());
  private readonly selectedDate = signal<NativeCalendarSelectedDate | null>(null);

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public getCountsByDate(): Signal<Map<string, number>> {
    return this.countsByDate;
  }

  public setCountsByDate(countsByDate: Map<string, number>): void {
    this.countsByDate.set(countsByDate);
  }

  public getSelectedDate(): Signal<NativeCalendarSelectedDate | null> {
    return this.selectedDate;
  }

  public setSelectedDate(selectedDate: NativeCalendarSelectedDate | null): void {
    this.selectedDate.set(selectedDate);
  }
}
