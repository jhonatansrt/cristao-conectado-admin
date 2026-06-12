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
import { Container } from '../../util/container.service';
import { DayActivitiesModal, DayActivityItem } from './day-activities-modal/day-activities-modal';

@Component({
  selector: 'app-scale',
  imports: [NativeCalendar],
  templateUrl: './scale.html',
  styleUrl: './scale.scss',
})
export class Scale implements OnInit, OnDestroy {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly nativeCalendarStore = inject(NativeCalendarStore);
  private readonly container = inject(Container);

  private readonly mockAddress = {
    place: 'Igreja',
    cep: '01310-100',
    number: '123',
    street: 'Avenida Paulista',
    district: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    latitude: '-23.5613',
    longitude: '-46.6562',
  };

  private readonly mockActivitiesPool: DayActivityItem[] = [
    {
      description: 'Limpeza',
      hourInitial: 800,
      hourFinal: 1100,
      peoples: [{ name: 'Meera Gonzalez' }, { name: 'Sheila Cruz' }, { name: 'Ivone Goncalves' }],
      address: this.mockAddress,
    },
    {
      description: 'Som',
      hourInitial: 900,
      hourFinal: 1200,
      peoples: [{ name: 'Carlos Silva' }],
      address: this.mockAddress,
    },
    {
      description: 'Recepção',
      hourInitial: 830,
      hourFinal: 1030,
      peoples: [{ name: 'Ana Souza' }],
      address: this.mockAddress,
    },
  ];

  private activitiesByDate = new Map<string, DayActivityItem[]>();

  constructor() {
    this.setButtonsActions();
  }

  ngOnInit(): void {
    this.nativeCalendarStore.setIsLoading(false);
  }

  private getMockMonthActivities(month: number, year: number): { date: string; count: number }[] {
    const monthLength = new Date(year, month, 0).getDate();
    const mockCounts = [2, 1, 3, 1, 2];

    return mockCounts.map((count, index) => {
      const day = ((index * 6) % monthLength) + 1;
      const date = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

      return { date, count };
    });
  }

  private getMockDayActivities(count: number): DayActivityItem[] {
    return Array.from(
      { length: count },
      (_, index) => this.mockActivitiesPool[index % this.mockActivitiesPool.length],
    );
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

  protected onMonthChange({ month, year }: NativeCalendarMonthChange): void {
    const monthActivities = this.getMockMonthActivities(month, year);

    this.nativeCalendarStore.setCountsByDate(
      new Map(monthActivities.map((activity) => [this.parseEndpointDateToKey(activity.date), activity.count])),
    );

    this.activitiesByDate = new Map(
      monthActivities.map((activity) => [
        this.parseEndpointDateToKey(activity.date),
        this.getMockDayActivities(activity.count),
      ]),
    );
  }

  private parseEndpointDateToKey(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  protected onDaySelect(selectedDate: NativeCalendarSelectedDate): void {
    const date = new Date(selectedDate.iso);
    const dateKey = [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0'),
    ].join('-');

    const activities = this.activitiesByDate.get(dateKey) ?? [];

    const modal = this.container.vcr?.createComponent(DayActivitiesModal);
    modal?.setInput('activities', activities);
  }
}
