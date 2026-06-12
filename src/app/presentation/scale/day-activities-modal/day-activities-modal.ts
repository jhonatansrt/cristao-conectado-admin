import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../../common/modal/modal.component';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';

export interface DayActivityPerson {
  name: string;
  avatarUrl?: string | null;
}

export interface DayActivityItem {
  tag: string;
  hourInitial: number;
  hourFinal: number;
  people: DayActivityPerson[];
}

@Component({
  selector: 'app-day-activities-modal',
  standalone: true,
  imports: [ModalComponent, AccordionComponent, MatIconModule, HourRangePipe],
  templateUrl: './day-activities-modal.html',
  styleUrl: './day-activities-modal.scss',
})
export class DayActivitiesModal {
  public readonly activities = input<DayActivityItem[]>([]);
}
