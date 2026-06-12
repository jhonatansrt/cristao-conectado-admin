import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import {
  NativeCalendar,
  NativeCalendarMonthChange,
} from '../common/native-calendar/native-calendar';
import {
  NativeCalendarSelectedDate,
  NativeCalendarStore,
} from '../../application/native-calendar/native-calendar-store';

@Component({
  selector: 'app-scale',
  imports: [NativeCalendar],
  templateUrl: './scale.html',
  styleUrl: './scale.scss',
})
export class Scale implements OnInit, OnDestroy {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly nativeCalendarStore = inject(NativeCalendarStore);

  constructor() {
    this.setButtonsActions();
  }

  ngOnInit(): void {
    this.nativeCalendarStore.setIsLoading(false);
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar atividade',
        onClick: () => {},
      },
    ]);
  }

  protected onMonthChange(monthChange: NativeCalendarMonthChange): void {}

  protected onDaySelect(selectedDate: NativeCalendarSelectedDate): void {}
}
