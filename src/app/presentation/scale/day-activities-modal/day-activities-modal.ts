import { Component, input } from '@angular/core';

import { ModalComponent } from '../../common/modal/modal.component';
import { CardComponent } from '../../common/card/card.component';

export interface DayActivityItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-day-activities-modal',
  standalone: true,
  imports: [ModalComponent, CardComponent],
  templateUrl: './day-activities-modal.html',
  styleUrl: './day-activities-modal.scss',
})
export class DayActivitiesModal {
  public readonly activities = input<DayActivityItem[]>([]);
}
