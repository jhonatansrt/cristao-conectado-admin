import { Component, input } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';

export interface DayEventItem {
  id: string;
  title: string;
  description: string;
  hourInitial?: number;
  hourFinal?: number;
}

@Component({
  selector: 'app-events-of-day-modal',
  standalone: true,
  imports: [ModalComponent, CardComponent, HourRangePipe],
  templateUrl: './events-of-day-modal.html',
  styleUrl: './events-of-day-modal.scss',
})
export class EventsOfDayModal {
  public readonly events = input<DayEventItem[]>([]);
  public readonly eventCardIcons: CardIconAction[] = [
    {
      name: 'chevron_right',
      action: () => {},
      ariaLabel: 'Ver detalhes do evento',
    },
  ];
}
