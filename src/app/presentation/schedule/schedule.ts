import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AddressModal } from './address-modal/address-modal';
import { NativeCalendar } from './native-calendar/native-calendar';

@Component({
  selector: 'app-schedule',
  imports: [NativeCalendar],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule implements OnInit, OnDestroy {
  private readonly headerStore = inject(HeaderStore);
  private readonly container = inject(Container);

  private readonly handleAddEvent = (): void => {
    this.container.vcr?.createComponent(AddressModal);
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
}
