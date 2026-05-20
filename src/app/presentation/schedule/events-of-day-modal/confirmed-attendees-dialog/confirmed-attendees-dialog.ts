import { Component, ElementRef, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DialogComponent } from '../../../common/dialog/dialog.component';

interface ConfirmedAttendee {
  id: string;
  name: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-confirmed-attendees-dialog',
  standalone: true,
  imports: [DialogComponent, MatIconModule],
  templateUrl: './confirmed-attendees-dialog.html',
  styleUrl: './confirmed-attendees-dialog.scss',
})
export class ConfirmedAttendeesDialog {
  private readonly el = inject(ElementRef);

  public readonly eventId = input<string>('');

  protected readonly attendees: ConfirmedAttendee[] = [
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
    {
      id: '1',
      name: 'Balaji Nair',
      avatarUrl: 'https://i.pravatar.cc/64?img=12',
    },
    {
      id: '2',
      name: 'Nithya Menon',
      avatarUrl: 'https://i.pravatar.cc/64?img=5',
    },
    {
      id: '3',
      name: 'Meera Gonzalez',
      avatarUrl: 'https://i.pravatar.cc/64?img=23',
    },
    {
      id: '4',
      name: 'Karthik Subramanian',
    },
  ];

  protected onClose(): void {
    this.el.nativeElement.remove();
  }
}
