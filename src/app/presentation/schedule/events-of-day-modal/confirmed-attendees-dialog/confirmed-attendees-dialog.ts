import { Component, ElementRef, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DialogComponent } from '../../../common/dialog/dialog.component';
import { ScheduleAttendance } from '../../../../domain/schedules';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';

interface ConfirmedAttendee {
  name: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-confirmed-attendees-dialog',
  standalone: true,
  imports: [DialogComponent, MatIconModule, CapitalizeNamePipe],
  templateUrl: './confirmed-attendees-dialog.html',
  styleUrl: './confirmed-attendees-dialog.scss',
})
export class ConfirmedAttendeesDialog {
  private readonly el = inject(ElementRef);

  public readonly attendances = input<ScheduleAttendance[]>([]);

  protected get attendees(): ConfirmedAttendee[] {
    return this.attendances().map((attendance) => ({
      name: attendance.name,
      avatarUrl: attendance.avatar ?? undefined,
    }));
  }

  protected onClose(): void {
    this.el.nativeElement.remove();
  }
}
