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

  protected readonly detailsMap = signal<Map<string, ScheduleDetails | 'loading'>>(new Map());

  protected onAccordionOpened(id: string): void {
    if (this.detailsMap().has(id)) return;

    const map = new Map(this.detailsMap());
    map.set(id, 'loading');
    this.detailsMap.set(map);

    this.schedulesService.getScheduleDetails(id).subscribe({
      next: (details) => {
        const updated = new Map(this.detailsMap());
        updated.set(id, details);
        this.detailsMap.set(updated);
      },
    });
  }

  protected getDetails(id: string): ScheduleDetails | 'loading' | null {
    return this.detailsMap().get(id) ?? null;
  }

  protected formatAddress(details: ScheduleDetails): string {
    return `${details.street}, ${details.number} - ${details.district}, ${details.city} - ${details.state}`;
  }
}
