import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { MenuStore } from '../../../application/menu/menu-store';
import { namedRoutes } from '../../../named-routes';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly menuStore = inject(MenuStore);
  private readonly navController = inject(Router);

  private readonly currentUrl = toSignal(
    this.navController.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.navController.url),
      startWith(this.navController.url),
    ),
    { initialValue: this.navController.url },
  );

  private readonly routeTitles: Record<string, string> = {
    [namedRoutes.home]: 'Home',
    [namedRoutes.members]: 'Membros',
    [namedRoutes.schedule]: 'Agenda',
    [namedRoutes.playlists]: 'Playlists',
    [namedRoutes.notices]: 'Avisos',
    [namedRoutes.church]: 'Igreja',
  };

  protected readonly title = computed(() => {
    const route = this.currentUrl().replace(/^\//, '').split('/')[0] ?? '';
    return this.routeTitles[route] ?? 'Igreja';
  });

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuStore.toggle();
  }
}
