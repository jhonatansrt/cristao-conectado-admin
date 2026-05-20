import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { SchedulesStore } from '../../../application/schedules/schedules-store';
import { SchedulesService } from '../../../application/schedules/schedules-service';
import { Container } from '../../../util/container.service';
import { EventsOfDayModal } from '../events-of-day-modal/events-of-day-modal';

export type CalendarCell = {
  weekDay: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  count: number | null;
};

@Component({
  selector: 'app-native-calendar',
  imports: [MatIconModule, SkeletonComponent],
  templateUrl: './native-calendar.html',
  styleUrl: './native-calendar.scss',
})
export class NativeCalendar {
  private readonly schedulesStore = inject(SchedulesStore);
  private readonly schedulesService = inject(SchedulesService);
  private readonly container = inject(Container);
  private readonly today = new Date();
  private readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  protected monthOffset = signal(0);

  protected isLoading = computed(() => this.schedulesStore.isLoadingCalendar());

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
        count:
          this.schedulesStore.monthSchedulesByDate().get(this.getMonthDateKey(year, month, day)) ??
          0,
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

  protected selectDay(cell: CalendarCell): void {
    if (!cell.isCurrentMonth || !cell.count) {
      return;
    }

    const date = this.visibleMonthDate();
    const selectedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), cell.dayNumber));
    const selectedDateISO = selectedDate.toISOString();
    const selectedWeekDay = selectedDate.getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    this.schedulesStore.setSelectedDate({ iso: selectedDateISO, weekDay: selectedWeekDay });

    this.schedulesService.getDaySchedules(selectedDateISO, selectedWeekDay).subscribe(() => {
      this.container.vcr?.createComponent(EventsOfDayModal);
    });
  }

  protected goToPreviousMonth(): void {
    if (!this.canGoPreviousMonth()) {
      return;
    }

    this.monthOffset.update((offset) => offset - 1);
    this.loadMonthSchedules();
  }

  protected goToNextMonth(): void {
    this.monthOffset.update((offset) => offset + 1);
    this.loadMonthSchedules();
  }

  private loadMonthSchedules(): void {
    const date = this.visibleMonthDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    this.schedulesStore.setCurrentMonthAndYear(month, year);
    this.schedulesStore.setIsLoadingCalendar(true);

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => this.schedulesStore.setIsLoadingCalendar(false)))
      .subscribe();
  }

  private visibleMonthDate(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset(), 1);
  }

  private getMonthDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}
