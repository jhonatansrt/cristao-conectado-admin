import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { SchedulesService } from '../../../application/schedules/schedules-service';
import { ScheduleDetails } from '../../../domain/schedules';
import { SchedulesStore } from '../../../application/schedules/schedules-store';
import { NativeCalendarStore } from '../../../application/native-calendar/native-calendar-store';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { ModalComponent } from '../../common/modal/modal.component';
import { ButtonComponent } from '../../common/button/button.component';
import { Container } from '../../../util/container.service';
import { AddEventModal, EditScheduleData } from '../add-event-modal/add-event-modal';
import { AlertService } from '../../common/alert/alert.service';
import { MapComponent } from '../../common/map/map.component';
import { ConfirmedAttendeesDialog } from './confirmed-attendees-dialog/confirmed-attendees-dialog';

export interface DayEventItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  address?: string;
  dayOfWeek?: string;
  hourInitial?: number;
  hourFinal?: number;
  day?: number;
  scheduleDate?: string | null;
}

@Component({
  selector: 'app-events-of-day-modal',
  standalone: true,
  imports: [ModalComponent, AccordionComponent, MatIconModule, HourRangePipe, ButtonComponent],
  templateUrl: './events-of-day-modal.html',
  styleUrl: './events-of-day-modal.scss',
})
export class EventsOfDayModal {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly schedulesService = inject(SchedulesService);
  private readonly schedulesStore = inject(SchedulesStore);
  private readonly nativeCalendarStore = inject(NativeCalendarStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);

  private hasHadEvents = false;

  constructor() {
    effect(() => {
      const count = this.events().length;
      if (count > 0) {
        this.hasHadEvents = true;
      } else if (this.hasHadEvents) {
        this.modal?.closeModal();
      }
    });
  }

  public readonly events = computed<DayEventItem[]>(() =>
    this.schedulesStore.getDaySchedules()().map((schedule) => ({
      id: schedule.id,
      title: schedule.title,
      description: schedule.schedule_date ?? '',
      hourInitial: schedule.hour_initial,
      hourFinal: schedule.hour_final,
      day: schedule.day,
      scheduleDate: schedule.schedule_date,
    })),
  );
  protected readonly loadingIds = signal(new Set<string>());
  protected readonly detailsMap = computed(() => this.schedulesStore.getScheduleDetailsMap()());

  private reloadSchedules(): void {
    const selectedDate = this.schedulesStore.getSelectedDate()();
    if (!selectedDate) return;

    const date = new Date(selectedDate.iso);
    this.schedulesService
      .getMonthSchedules(date.getUTCMonth() + 1, date.getUTCFullYear())
      .subscribe(() => this.nativeCalendarStore.setCountsByDate(this.schedulesStore.getMonthSchedulesByDate()()));
    this.schedulesService.getDaySchedules(selectedDate.iso, selectedDate.weekDay).subscribe();
  }

  protected onAccordionOpened(id: string): void {
    if (this.loadingIds().has(id)) {
      return;
    }

    this.loadingIds.update((prev) => new Set(prev).add(id));

    this.schedulesService.getScheduleDetails(id).subscribe({
      next: () => this.loadingIds.update((prev) => { const s = new Set(prev); s.delete(id); return s; }),
    });
  }

  protected getDetails(id: string): ScheduleDetails | 'loading' | null {
    if (this.loadingIds().has(id)) return 'loading';
    return this.detailsMap()[id] ?? null;
  }

  protected formatAddress(details: ScheduleDetails): string {
    return `${details.street}, ${details.number} - ${details.district}, ${details.city} - ${details.state}`;
  }

  protected async onDeleteEvent(event: DayEventItem): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o evento?',
    });

    if (!confirmed) {
      return;
    }

    await firstValueFrom(this.schedulesService.deleteSchedule(event.id));

    this.schedulesStore.clearScheduleDetails(event.id);

    this.reloadSchedules();
  }

  protected onOpenMap(event: DayEventItem): void {
    const details = this.detailsMap()[event.id];
    if (!details) return;

    const mapRef = this.container.vcr?.createComponent(MapComponent);
    if (!mapRef) return;

    mapRef.setInput('geocodedAddress', {
      lat: parseFloat(details.latitude),
      lng: parseFloat(details.longitude),
      street: details.street,
      number: details.number,
      district: details.district,
      city: details.city,
      state: details.state,
      cep: details.cep,
    });
    mapRef.setInput('readOnly', true);

    mapRef.instance.close.subscribe(() => mapRef.destroy());
  }

  protected onOpenConfirmedAttendees(event: DayEventItem): void {
    const details = this.detailsMap()[event.id];
    if (!details) return;

    const dialogRef = this.container.vcr?.createComponent(ConfirmedAttendeesDialog);
    dialogRef?.setInput('attendances', details.attendances);
  }

  protected onEditEvent(event: DayEventItem): void {
    const details = this.detailsMap()[event.id];
    if (!details) return;

    const address = {
      id: details.address_id,
      place: details.place,
      cep: details.cep,
      number: details.number,
      street: details.street,
      district: details.district,
      city: details.city,
      state: details.state,
      latitude: details.latitude,
      longitude: details.longitude,
    };

    const editData: EditScheduleData = {
      scheduleId: details.schedule_id,
      title: event.title,
      description: details.description,
      hourInitial: event.hourInitial ?? 0,
      hourFinal: event.hourFinal ?? 0,
      day: event.day,
      scheduleDate: event.scheduleDate ?? undefined,
    };

    this.schedulesStore.setScheduleToEdit(editData);
    const modal = this.container.vcr?.createComponent(AddEventModal);
    modal?.setInput('address', address);
  }
}
