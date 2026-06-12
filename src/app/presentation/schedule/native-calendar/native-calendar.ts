import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { NativeCalendarSelectedDate, NativeCalendarStore } from '../../../application/native-calendar/native-calendar-store';

export type CalendarCell = {
  weekDay: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  count: number | null;
};

export type NativeCalendarMonthChange = {
  month: number;
  year: number;
};

@Component({
  selector: 'app-native-calendar',
  imports: [MatIconModule, SkeletonComponent],
  templateUrl: './native-calendar.html',
  styleUrl: './native-calendar.scss',
})
export class NativeCalendar {
  private readonly nativeCalendarStore = inject(NativeCalendarStore);
  private readonly today = new Date();
  private readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  public readonly monthChange = output<NativeCalendarMonthChange>();
  public readonly daySelect = output<NativeCalendarSelectedDate>();

  protected monthOffset = signal(0);

  protected isLoading = computed(() => this.nativeCalendarStore.getIsLoading()());

  protected monthTitle = computed(() => {
    const date = this.visibleMonthDate();

    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  });

  protected canGoPreviousMonth = computed(() => this.monthOffset() > 0);

  protected calendarCells = computed((): CalendarCell[] => {
    const currentMonthDate = this.visibleMonthDate();
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
        count: null,
      });
    }

    for (let day = 1; day <= monthLength; day += 1) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: day,
        isCurrentMonth: true,
        count: this.nativeCalendarStore.getCountsByDate()().get(this.getMonthDateKey(year, month, day)) ?? 0,
      });
    }

    while (cells.length % 7 !== 0 || cells.length < 35) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: cells.length - (leadingDays + monthLength) + 1,
        isCurrentMonth: false,
        count: null,
      });
    }

    return cells;
  });

  constructor() {
    effect(() => {
      const date = this.visibleMonthDate();
      this.monthChange.emit({ month: date.getMonth() + 1, year: date.getFullYear() });
    });
  }

  protected selectDay(cell: CalendarCell): void {
    if (!cell.isCurrentMonth || !cell.count) {
      return;
    }

    const date = this.visibleMonthDate();
    const selectedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), cell.dayNumber));
    const selectedDateISO = selectedDate.toISOString();
    const selectedWeekDay = selectedDate.getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const selected: NativeCalendarSelectedDate = { iso: selectedDateISO, weekDay: selectedWeekDay };

    this.nativeCalendarStore.setSelectedDate(selected);
    this.daySelect.emit(selected);
  }

  protected goToPreviousMonth(): void {
    if (!this.canGoPreviousMonth()) {
      return;
    }

    this.monthOffset.update((offset) => offset - 1);
  }

  protected goToNextMonth(): void {
    this.monthOffset.update((offset) => offset + 1);
  }

  private visibleMonthDate(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset(), 1);
  }

  private getMonthDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}
