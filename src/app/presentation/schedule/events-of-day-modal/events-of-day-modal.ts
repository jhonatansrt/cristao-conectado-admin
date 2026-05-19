import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { ModalComponent } from '../../common/modal/modal.component';

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

const MOCK_EVENTS: DayEventItem[] = [
  {
    id: 'mock-1',
    title: 'EBD',
    subtitle: 'IBT - Igreja Batista Transcoqueiro',
    description: 'Estudo bíblico para todas as idades',
    location: 'IBT',
    address: 'Av. Independência, 200 - Coqueiro, Ananindeua - PA',
    dayOfWeek: 'Domingo',
    hourInitial: 900,
    hourFinal: 1000,
  },
  {
    id: 'mock-2',
    title: 'Culto',
    subtitle: 'PIB do Icuí',
    description: 'Venha e traga a sua família',
    location: 'PIB do Icuí',
    address: 'R. Leonardo da Silva, 1111 - Icuí-Guajará, Ananindeua - PA',
    dayOfWeek: 'Domingo',
    hourInitial: 1900,
    hourFinal: 2030,
  },
  {
    id: 'mock-3',
    title: 'Reunião de Oração',
    subtitle: 'Igreja Sede',
    description: 'Momento de intercessão e adoração coletiva',
    location: 'Igreja Sede',
    address: 'Av. Principal, 500 - Centro, Belém - PA',
    dayOfWeek: 'Quarta-feira',
    hourInitial: 1900,
    hourFinal: 2000,
  },
  {
    id: 'mock-4',
    title: 'Célula de Jovens',
    subtitle: 'Casa do líder',
    description: 'Encontro semanal da célula de jovens',
    location: 'Casa do Líder',
    address: 'R. das Flores, 88 - Mangueirão, Belém - PA',
    dayOfWeek: 'Sexta-feira',
    hourInitial: 1930,
    hourFinal: 2100,
  },
];

@Component({
  selector: 'app-events-of-day-modal',
  standalone: true,
  imports: [ModalComponent, AccordionComponent, MatIconModule, HourRangePipe],
  templateUrl: './events-of-day-modal.html',
  styleUrl: './events-of-day-modal.scss',
})
export class EventsOfDayModal {
  public readonly events = input<DayEventItem[]>([]);

  protected readonly displayEvents = computed<DayEventItem[]>(() =>
    this.events().length ? this.events() : MOCK_EVENTS,
  );
}
