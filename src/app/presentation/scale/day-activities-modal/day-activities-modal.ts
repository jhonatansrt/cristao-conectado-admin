import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../../common/modal/modal.component';
import { AccordionComponent } from '../../common/accordion/accordion.component';
import { HourRangePipe } from '../../../pipes/hour-range.pipe';
import { AlertService } from '../../common/alert/alert.service';

export interface DayActivityPerson {
  name: string;
  avatarUrl?: string | null;
}

export interface DayActivityItem {
  description: string;
  hourInitial: number;
  hourFinal: number;
  peoples: DayActivityPerson[];
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

  public readonly activities = input<DayActivityItem[]>([]);

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
