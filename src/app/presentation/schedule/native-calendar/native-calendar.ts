import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { SchedulesService } from '../../../application/schedules/schedules-service';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { Container } from '../../../util/container.service';
import { DayEventItem, EventsOfDayModal } from '../events-of-day-modal/events-of-day-modal';

type CalendarCell = {
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
export class NativeCalendar implements OnInit {
  private schedulesService = inject(SchedulesService);
  private readonly container = inject(Container);
  private readonly today = new Date();
  private readonly weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  private monthSchedulesByDate = new Map<string, number>();
  protected monthOffset = 0;
  protected isLoading = true;

  public ngOnInit(): void {
    this.loadMonthSchedules();
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


  protected openDayEvents(cell: CalendarCell): void {
    if (!cell.isCurrentMonth || !cell.count) {
      return;
    }

    const eventModal = this.container.vcr?.createComponent(EventsOfDayModal);

    if (!eventModal) {
      return;
    }

    eventModal.setInput('events', this.buildDayEvents(cell.count));
  }

  private buildDayEvents(eventCount: number): DayEventItem[] {
    return Array.from({ length: eventCount }, (_, index) => ({
      title: `Igreja Batista Transcoqueiro ${index + 1}`,
      description: 'Av. XYZ, 123 - Belém/PA',
    }));
  }

  protected goToPreviousMonth(): void {
    if (!this.canGoPreviousMonth) {
      return;
    }

    this.monthOffset -= 1;
    this.loadMonthSchedules();
  }

  protected goToNextMonth(): void {
    this.monthOffset += 1;
    this.loadMonthSchedules();
  }

  private get visibleMonthDate(): Date {
    return new Date(this.today.getFullYear(), this.today.getMonth() + this.monthOffset, 1);
  }

  private loadMonthSchedules(): void {
    const date = this.visibleMonthDate;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.isLoading = true;

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((monthSchedules) => {
        this.monthSchedulesByDate = new Map(
          monthSchedules.map((schedule) => [this.parseEndpointDateToKey(schedule.date), schedule.count]),
        );
      });
  }

  private parseEndpointDateToKey(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  private getMonthDateKey(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}
