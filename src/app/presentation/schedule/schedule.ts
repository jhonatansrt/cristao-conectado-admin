import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';

import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AddressList } from './address-list/address-list';
import { NativeCalendar } from './native-calendar/native-calendar';
import { SchedulesService } from '../../application/schedules/schedules-service';
import { SchedulesStore } from '../../application/schedules/schedules-store';

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
  private readonly schedulesStore = inject(SchedulesStore);

  private readonly handleAddEvent = (): void => {
    this.container.vcr?.createComponent(AddressList);
  };

  public ngOnInit(): void {
    this.loadMonthSchedules(this.schedulesStore.currentMonth(), this.schedulesStore.currentYear());

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

  protected loadMonthSchedules(month: number, year: number): void {
    this.schedulesStore.setCurrentMonthAndYear(month, year);
    this.schedulesStore.setIsLoadingCalendar(true);

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => this.schedulesStore.setIsLoadingCalendar(false)))
      .subscribe();
  }
}
