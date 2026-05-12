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
    { label: 'Home', icon: 'home', selected: false },
    { label: 'Membros', icon: 'person_outline', selected: true },
    { label: 'Agenda', icon: 'calendar_month', selected: false },
    { label: 'Playlists', icon: 'smart_display', selected: false },
    { label: 'Avisos', icon: 'warning_amber', selected: false },
    { label: 'Igreja', icon: 'church', selected: false },
  ];
}
