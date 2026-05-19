import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';

import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AddressList } from './address-list/address-list';
import { NativeCalendar, CalendarDaySelect, CalendarMonthChange } from './native-calendar/native-calendar';
import { SchedulesService } from '../../application/schedules/schedules-service';
import { DayEventItem, EventsOfDayModal } from './events-of-day-modal/events-of-day-modal';

@Component({
  selector: 'app-schedule',
  imports: [NativeCalendar],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule implements OnInit, OnDestroy {
  private readonly headerStore = inject(HeaderStore);
  private readonly container = inject(Container);
  private readonly schedulesService = inject(SchedulesService);

  protected isLoading = true;
  protected monthSchedulesByDate = new Map<string, number>();

  private readonly handleAddEvent = (): void => {
    this.container.vcr?.createComponent(AddressList);
  };

  public ngOnInit(): void {
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar evento',
        onClick: this.handleAddEvent,
      },
    ]);
  }

  public ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }

  protected handleMonthChanged({ month, year }: CalendarMonthChange): void {
    this.isLoading = true;

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (monthSchedules) => {
          this.monthSchedulesByDate = new Map(
            monthSchedules.map((schedule) => [this.parseEndpointDateToKey(schedule.date), schedule.count]),
          );
        },
        error: () => {},
      });
  }

  protected handleDaySelected({ day, month, year }: CalendarDaySelect): void {
    const selectedDate = new Date(Date.UTC(year, month - 1, day));
    const selectedDateISO = selectedDate.toISOString();
    const selectedWeekDay = selectedDate.getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    this.schedulesService.getDaySchedules(selectedDateISO, selectedWeekDay).subscribe({
      next: (daySchedules) => {
        const eventModal = this.container.vcr?.createComponent(EventsOfDayModal);

        if (!eventModal) {
          return;
        }

        eventModal.setInput(
          'events',
          daySchedules.map((schedule) => ({
            id: schedule.id,
            title: schedule.title,
            description: schedule.schedule_date ?? '',
            hourInitial: schedule.hour_initial,
            hourFinal: schedule.hour_final,
          })),
        );
      },
      error: () => {},
    });
  }

  private parseEndpointDateToKey(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
