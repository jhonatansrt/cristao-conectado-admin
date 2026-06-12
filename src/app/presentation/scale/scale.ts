import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import {
  NativeCalendar,
  NativeCalendarMonthChange,
} from '../common/native-calendar/native-calendar';
import {
  NativeCalendarSelectedDate,
  NativeCalendarStore,
} from '../../application/native-calendar/native-calendar-store';

@Component({
  selector: 'app-scale',
  imports: [NativeCalendar],
  templateUrl: './scale.html',
  styleUrl: './scale.scss',
})
export class Scale implements OnInit, OnDestroy {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly nativeCalendarStore = inject(NativeCalendarStore);

  constructor() {
    this.setButtonsActions();
  }

  ngOnInit(): void {
    this.nativeCalendarStore.setIsLoading(false);
  }

  private getMockMonthActivities(month: number, year: number): { date: string; count: number }[] {
    const monthLength = new Date(year, month, 0).getDate();
    const mockCounts = [2, 1, 3, 1, 2];

    return mockCounts.map((count, index) => {
      const day = ((index * 6) % monthLength) + 1;
      const date = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

      return { date, count };
    });
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar atividade',
        onClick: () => {},
      },
    ]);
  }

  protected onMonthChange({ month, year }: NativeCalendarMonthChange): void {
    const monthActivities = this.getMockMonthActivities(month, year);

    this.nativeCalendarStore.setCountsByDate(
      new Map(monthActivities.map((activity) => [this.parseEndpointDateToKey(activity.date), activity.count])),
    );
  }

  private parseEndpointDateToKey(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  protected onDaySelect(selectedDate: NativeCalendarSelectedDate): void {}
}
