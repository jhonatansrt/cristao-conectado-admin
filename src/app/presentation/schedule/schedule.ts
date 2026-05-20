import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';

import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AddressList } from './address-list/address-list';
import {
  NativeCalendar,
  CalendarDaySelect,
  CalendarMonthChange,
} from './native-calendar/native-calendar';
import { SchedulesService } from '../../application/schedules/schedules-service';
import { DaySchedule } from '../../domain/schedules';
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

  private currentMonth = new Date().getMonth() + 1;
  private currentYear = new Date().getFullYear();
  private selectedDate: { iso: string; weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 } | null = null;

  private readonly handleAddEvent = (): void => {
    const addressList = this.container.vcr?.createComponent(AddressList);
    addressList?.instance.eventCreated.subscribe(() => {
      this.handleMonthChanged({ month: this.currentMonth, year: this.currentYear });
    });
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
    this.currentMonth = month;
    this.currentYear = year;
    this.isLoading = true;

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => (this.isLoading = false)));
  }

  protected handleDaySelected({ day, month, year }: CalendarDaySelect): void {
    const selectedDate = new Date(Date.UTC(year, month - 1, day));
    const selectedDateISO = selectedDate.toISOString();
    const selectedWeekDay = selectedDate.getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    this.selectedDate = { iso: selectedDateISO, weekDay: selectedWeekDay };

    this.schedulesService.getDaySchedules(selectedDateISO, selectedWeekDay).subscribe({
      next: (daySchedules) => {
        const eventModal = this.container.vcr?.createComponent(EventsOfDayModal);

        if (!eventModal) {
          return;
        }

        eventModal.setInput('events', this.mapDaySchedules(daySchedules));

        eventModal.instance.eventEdited.subscribe(() => {
          this.handleMonthChanged({ month: this.currentMonth, year: this.currentYear });

          if (!this.selectedDate) return;
          this.schedulesService
            .getDaySchedules(this.selectedDate.iso, this.selectedDate.weekDay)
            .subscribe({
              next: (updated) => {
                if (updated.length === 0) {
                  eventModal.destroy();
                  return;
                }
                eventModal.setInput('events', this.mapDaySchedules(updated));
              },
              error: () => {},
            });
        });
      },
      error: () => {},
    });
  }

  private mapDaySchedules(daySchedules: DaySchedule[]): DayEventItem[] {
    return daySchedules.map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.schedule_date ?? '',
      hourInitial: schedule.hour_initial,
      hourFinal: schedule.hour_final,
      day: schedule.day,
      scheduleDate: schedule.schedule_date,
    }));
  }
}
