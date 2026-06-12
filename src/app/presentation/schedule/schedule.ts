import { Component, OnDestroy, inject } from '@angular/core';
import { finalize } from 'rxjs';

import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Container } from '../../util/container.service';
import { AddressList } from './address-list/address-list';
import { NativeCalendar, NativeCalendarMonthChange } from './native-calendar/native-calendar';
import { SchedulesService } from '../../application/schedules/schedules-service';
import { SchedulesStore } from '../../application/schedules/schedules-store';
import { NativeCalendarSelectedDate, NativeCalendarStore } from '../../application/native-calendar/native-calendar-store';
import { EventsOfDayModal } from './events-of-day-modal/events-of-day-modal';

@Component({
  selector: 'app-schedule',
  imports: [NativeCalendar],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule implements OnDestroy {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly schedulesService = inject(SchedulesService);
  private readonly schedulesStore = inject(SchedulesStore);
  private readonly nativeCalendarStore = inject(NativeCalendarStore);

  constructor() {
    this.setButtonsActions();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar evento',
        onClick: () => this.container.vcr?.createComponent(AddressList),
      },
    ]);
  }

  protected onMonthChange({ month, year }: NativeCalendarMonthChange): void {
    this.schedulesStore.setCurrentMonthAndYear(month, year);
    this.nativeCalendarStore.setIsLoading(true);

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => this.nativeCalendarStore.setIsLoading(false)))
      .subscribe(() => {
        this.nativeCalendarStore.setCountsByDate(this.schedulesStore.getMonthSchedulesByDate()());
      });
  }

  protected onDaySelect(selectedDate: NativeCalendarSelectedDate): void {
    this.schedulesStore.setSelectedDate(selectedDate);

    this.schedulesService.getDaySchedules(selectedDate.iso, selectedDate.weekDay).subscribe(() => {
      this.container.vcr?.createComponent(EventsOfDayModal);
    });
  }
}
