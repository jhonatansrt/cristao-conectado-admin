import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../button/button.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { HeaderStore } from '../../../application/header/header-store';
import { MenuStore } from '../../../application/menu/menu-store';
import { namedRoutes } from '../../../named-routes';
import { PlaylistSelectedStore } from '../../../application/playlists/playlist-selected-store';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, ButtonComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly menuStore = inject(MenuStore);
  private readonly headerStore = inject(HeaderStore);
  private readonly navController = inject(Router);
  private readonly playlistSelectedStore = inject(PlaylistSelectedStore);

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
    [namedRoutes.testimonials]: 'Testemunhos',
    [namedRoutes.pray]: 'Pedidos de oração',
    [namedRoutes.church]: 'Igreja',
    [namedRoutes.requests]: 'Solicitações',
  };

  protected readonly buttonsActions = this.headerStore.getButtonsActions();

  protected readonly title = computed(() => {
    const route = this.currentUrl().replace(/^\//, '').split('/')[0] ?? '';

    if (route === namedRoutes.videos) {
      return this.playlistSelectedStore.getPlaylistSelected()()[0]?.name ?? 'Vídeos';
    }

    return this.routeTitles[route] ?? 'Igreja';
  });

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuStore.toggle();
  }
}
