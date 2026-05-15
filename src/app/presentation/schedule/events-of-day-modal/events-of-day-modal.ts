import { Component, input } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { CardComponent } from '../../common/card/card.component';

export interface DayEventItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-events-of-day-modal',
  standalone: true,
  imports: [ModalComponent, CardComponent],
  templateUrl: './events-of-day-modal.html',
  styleUrl: './events-of-day-modal.scss',
})
export class EventsOfDayModal {
  public readonly dateLabel = input<string>('');
  public readonly events = input<DayEventItem[]>([]);
}
