import { Component, inject, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SchedulesService } from '../../../application/schedules/schedules-service';
import { ScheduleDetails } from '../../../domain/schedules';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { ModalComponent } from '../../common/modal/modal.component';
import { ButtonComponent } from '../../common/button/button.component';

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

  public readonly events = input<DayEventItem[]>([]);

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
}
