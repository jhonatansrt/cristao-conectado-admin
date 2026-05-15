import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';

export type CalendarCell = {
  weekDay: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  count: number | null;
};

export type CalendarMonthChange = {
  month: number;
  year: number;
};

export type CalendarDaySelect = {
  day: number;
  month: number;
  year: number;
  count: number;
};

@Component({
  selector: 'app-native-calendar',
  imports: [MatIconModule, SkeletonComponent],
  templateUrl: './native-calendar.html',
  styleUrl: './native-calendar.scss',
})
export class NativeCalendar implements OnInit {
  private readonly today = new Date();
  private readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  @Input() public isLoading = true;
  @Input() public monthSchedulesByDate = new Map<string, number>();
  @Output() public monthChanged = new EventEmitter<CalendarMonthChange>();
  @Output() public daySelected = new EventEmitter<CalendarDaySelect>();

  protected monthOffset = 0;

  public ngOnInit(): void {
    this.emitMonthChange();
  }

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
        count: null,
      });
    }

    for (let day = 1; day <= monthLength; day += 1) {
      cells.push({
        weekDay: this.weekDays[cells.length % 7],
        dayNumber: day,
        isCurrentMonth: true,
        count: this.monthSchedulesByDate.get(this.getMonthDateKey(year, month, day)) ?? 0,
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
  }

  protected selectDay(cell: CalendarCell): void {
    if (!cell.isCurrentMonth || !cell.count) {
      return;
    }

    const date = this.visibleMonthDate;
    this.daySelected.emit({
      day: cell.dayNumber,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      count: cell.count,
    });
  }

  protected goToPreviousMonth(): void {
    if (!this.canGoPreviousMonth) {
      return;
    }

    this.monthOffset -= 1;
    this.emitMonthChange();
  }

  protected goToNextMonth(): void {
    this.monthOffset += 1;
    this.emitMonthChange();
  }

  private get visibleMonthDate(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset, 1);
  }

  private emitMonthChange(): void {
    const date = this.visibleMonthDate;
    this.monthChanged.emit({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }

  private getMonthDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}
