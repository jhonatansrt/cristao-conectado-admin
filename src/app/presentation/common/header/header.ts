import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ButtonComponent } from '../button/button.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
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
  private readonly actionBarStore = inject(ActionBarStore);
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
    [namedRoutes.membersReports]: 'Relatórios de membros',
    [namedRoutes.schedule]: 'Agenda',
    [namedRoutes.scale]: 'Escala',
    [namedRoutes.playlists]: 'Playlists',
    [namedRoutes.notices]: 'Avisos',
    [namedRoutes.positions]: 'Cargos',
    [namedRoutes.testimonials]: 'Testemunhos',
    [namedRoutes.pray]: 'Pedidos de oração',
    [namedRoutes.church]: 'Igreja',
    [namedRoutes.requests]: 'Solicitações',
  };

  protected readonly buttonsActions = this.actionBarStore.getButtonsActions();

  protected readonly title = computed(() => {
    const fullPath = this.currentUrl().replace(/^\//, '');
    const firstSegment = fullPath.split('/')[0] ?? '';

    if (firstSegment === namedRoutes.videos) {
      return this.playlistSelectedStore.getPlaylistSelected()()[0]?.name ?? 'Vídeos';
    }

    return this.routeTitles[fullPath] ?? this.routeTitles[firstSegment] ?? 'Igreja';
  });

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuStore.toggle();
  }
}
