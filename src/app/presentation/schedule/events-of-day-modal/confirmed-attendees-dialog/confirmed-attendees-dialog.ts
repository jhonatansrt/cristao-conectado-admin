import { Component, ElementRef, inject, input } from '@angular/core';

import { DialogComponent } from '../../../common/dialog/dialog.component';
import { ScheduleAttendance } from '../../../../domain/schedules';

interface ConfirmedAttendee {
  name: string;
  initials: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-confirmed-attendees-dialog',
  standalone: true,
  imports: [DialogComponent],
  templateUrl: './confirmed-attendees-dialog.html',
  styleUrl: './confirmed-attendees-dialog.scss',
})
export class ConfirmedAttendeesDialog {
  private readonly el = inject(ElementRef);

  public readonly attendances = input<ScheduleAttendance[]>([]);

  protected get attendees(): ConfirmedAttendee[] {
    return this.attendances().map((attendance) => ({
      name: attendance.name,
      initials: this.getInitials(attendance.name),
      avatarUrl: attendance.avatar ?? undefined,
    }));
  }

  private getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  protected onClose(): void {
    this.el.nativeElement.remove();
  }
}
