import { Component, inject, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SchedulesService } from '../../../application/schedules/schedules-service';
import { ScheduleDetails } from '../../../domain/schedules';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { ModalComponent } from '../../common/modal/modal.component';
import { ButtonComponent } from '../../common/button/button.component';
import { Container } from '../../../util/container.service';
import { AddEventModal } from '../add-event-modal/add-event-modal';

export interface DayEventItem {
  id: string;
  title: string;
  subtitle: string;
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
  private readonly schedulesService = inject(SchedulesService);
  private readonly container = inject(Container);

  public readonly events = input<DayEventItem[]>([]);
  public readonly eventEdited = output<void>();

  protected readonly detailsMap = signal<Record<string, ScheduleDetails | 'loading'>>({});

  protected onAccordionOpened(id: string): void {
    if (this.detailsMap()[id]) {
      return;
    }

    this.detailsMap.update((prev) => ({ ...prev, [id]: 'loading' }));

    this.schedulesService.getScheduleDetails(id).subscribe({
      next: (details) => {
        this.detailsMap.update((prev) => ({ ...prev, [id]: details }));
      },
    });
  }

  protected getDetails(id: string): ScheduleDetails | 'loading' | null {
    return this.detailsMap()[id] ?? null;
  }

  protected formatAddress(details: ScheduleDetails): string {
    return `${details.street}, ${details.number} - ${details.district}, ${details.city} - ${details.state}`;
  }

  protected onEditEvent(event: DayEventItem): void {
    const details = this.detailsMap()[event.id];
    if (!details || details === 'loading') return;

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

    const editData = {
      scheduleId: details.schedule_id,
      title: event.title,
      description: details.description,
      hourInitial: event.hourInitial ?? 0,
      hourFinal: event.hourFinal ?? 0,
      ...(event.scheduleDate ? { scheduleDate: event.scheduleDate } : { day: event.day }),
    };

    const modal = this.container.vcr?.createComponent(AddEventModal);
    modal?.setInput('address', address);
    modal?.setInput('editData', editData);

    modal?.instance.eventCreated.subscribe(() => {
      this.detailsMap.update((prev) => {
        const updated = { ...prev };
        delete updated[event.id];
        return updated;
      });
      this.eventEdited.emit();
    });
  }
}
