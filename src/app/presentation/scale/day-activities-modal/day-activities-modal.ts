import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../../common/modal/modal.component';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';

export interface DayActivityItem {
  name: string;
  tag: string;
  avatarUrl?: string | null;
  hourInitial: number;
  hourFinal: number;
  description: string;
}

@Component({
  selector: 'app-day-activities-modal',
  standalone: true,
  imports: [ModalComponent, MatIconModule, HourRangePipe],
  templateUrl: './day-activities-modal.html',
  styleUrl: './day-activities-modal.scss',
})
export class DayActivitiesModal {
  public readonly activities = input<DayActivityItem[]>([]);
}
