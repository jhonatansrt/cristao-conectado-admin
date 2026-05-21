import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';

import { ActionBarStore } from '../../application/action-bar/action-bar-store';
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
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly schedulesService = inject(SchedulesService);
  private readonly schedulesStore = inject(SchedulesStore);

  ngOnInit(): void {
    this.loadMonthSchedules();
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

  protected loadMonthSchedules(): void {
    const month = this.schedulesStore.getCurrentMonth()();
    const year = this.schedulesStore.getCurrentYear()();
    this.schedulesStore.setCurrentMonthAndYear(month, year);
    this.schedulesStore.setIsLoadingCalendar(true);

    this.schedulesService
      .getMonthSchedules(month, year)
      .pipe(finalize(() => this.schedulesStore.setIsLoadingCalendar(false)))
      .subscribe();
  }
}
