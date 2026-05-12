import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-items',
  imports: [MatIconModule],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.scss',
})
export class MenuItems {
  protected readonly items = [
    { label: 'Home', icon: 'home' },
    { label: 'Membros', icon: 'person_outline' },
    { label: 'Agenda', icon: 'calendar_month' },
    { label: 'Playlists', icon: 'smart_display' },
    { label: 'Avisos', icon: 'warning_amber' },
    { label: 'Igreja', icon: 'church' },
  ];
}
