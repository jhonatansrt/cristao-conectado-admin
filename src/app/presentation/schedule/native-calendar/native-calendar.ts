import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type CalendarCell = {
  weekDay: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

@Component({
  selector: 'app-native-calendar',
  imports: [MatIconModule],
  templateUrl: './native-calendar.html',
  styleUrl: './native-calendar.scss',
})
export class NativeCalendar {
  private readonly today = new Date();
  private readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  protected monthOffset = 0;

  protected get monthTitle(): string {
    const date = this.visibleMonthDate;

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  protected get canGoPreviousMonth(): boolean {
    return this.monthOffset > 0;
  }

  protected get calendarCells(): CalendarCell[] {
    const currentMonthDate = this.visibleMonthDate;
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const leadingDays = firstDayOfMonth.getDay();
    const monthLength = lastDayOfMonth.getDate();

    const previousMonthLastDay = new Date(year, month, 0).getDate();
    const cells: CalendarCell[] = [];

    for (let index = leadingDays; index > 0; index -= 1) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: previousMonthLastDay - index + 1,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= monthLength; day += 1) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: day,
        isCurrentMonth: true,
      });
    }

    while (cells.length % 7 !== 0 || cells.length < 35) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: cells.length - (leadingDays + monthLength) + 1,
        isCurrentMonth: false,
      });
    }

    return cells;
  }

  protected goToPreviousMonth(): void {
    if (!this.canGoPreviousMonth) {
      return;
    }

    this.monthOffset -= 1;
  }

  protected goToNextMonth(): void {
    this.monthOffset += 1;
  }

  private get visibleMonthDate(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset, 1);
  }
}
