import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { namedRoutes } from '../../../../named-routes';

@Component({
  selector: 'app-menu-items',
  imports: [MatIconModule],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.scss',
})
export class MenuItems {
  private readonly navController = inject(Router);

  private readonly currentUrl = toSignal(
    this.navController.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.navController.url),
      startWith(this.navController.url),
    ),
    { initialValue: this.navController.url },
  );

  protected readonly items = [
    { label: 'Home', icon: 'home_outlined', route: namedRoutes.home },
    { label: 'Membros', icon: 'person_outline', route: namedRoutes.members },
    { label: 'Agenda', icon: 'calendar_month', route: namedRoutes.schedule },
    { label: 'Playlists', icon: 'smart_display', route: namedRoutes.playlists },
    { label: 'Avisos', icon: 'warning_amber', route: namedRoutes.notices },
    { label: 'Igreja', icon: 'church', route: namedRoutes.church },
  ];

  protected readonly selectedRoute = computed(() =>
    this.currentUrl().replace(/^\//, '').split('/')[0] ?? '',
  );

  protected navigate(route: string): void {
    void this.navController.navigate([route]);
  }
}
