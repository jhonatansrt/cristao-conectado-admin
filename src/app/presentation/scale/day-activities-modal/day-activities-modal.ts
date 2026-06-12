import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../../common/modal/modal.component';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AlertService } from '../../common/alert/alert.service';
import { MapComponent } from '../../common/map/map.component';
import { Container } from '../../../util/container.service';

export interface DayActivityPerson {
  name: string;
  avatarUrl?: string | null;
}

export interface DayActivityAddress {
  place: string;
  cep: string;
  number: string;
  street: string;
  district: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
}

export interface DayActivityItem {
  description: string;
  hourInitial: number;
  hourFinal: number;
  peoples: DayActivityPerson[];
  address?: DayActivityAddress;
}

@Component({
  selector: 'app-day-activities-modal',
  standalone: true,
  imports: [ModalComponent, AccordionComponent, MatIconModule, HourRangePipe],
  templateUrl: './day-activities-modal.html',
  styleUrl: './day-activities-modal.scss',
})
export class DayActivitiesModal {
  private readonly alertService = inject(AlertService);
  private readonly container = inject(Container);

  public readonly activities = input<DayActivityItem[]>([]);

  protected formatAddress(address: DayActivityAddress): string {
    return `${address.street}, ${address.number} - ${address.district}, ${address.city} - ${address.state}`;
  }

  protected onOpenMap(activity: DayActivityItem): void {
    const address = activity.address;
    if (!address) return;

    const mapRef = this.container.vcr?.createComponent(MapComponent);
    if (!mapRef) return;

    mapRef.setInput('geocodedAddress', {
      lat: parseFloat(address.latitude),
      lng: parseFloat(address.longitude),
      street: address.street,
      number: address.number,
      district: address.district,
      city: address.city,
      state: address.state,
      cep: address.cep,
    });
    mapRef.setInput('readOnly', true);

    mapRef.instance.close.subscribe(() => mapRef.destroy());
  }

  protected onEditActivity(activity: DayActivityItem): void {
    // TODO: implementar edição da atividade
    console.log('Editar atividade', activity);
  }

  protected async onDeleteActivity(activity: DayActivityItem): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir a atividade?',
    });

    if (!confirmed) {
      return;
    }

    // TODO: implementar exclusão da atividade
    console.log('Excluir atividade', activity);
  }
}
