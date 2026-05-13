import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { namedRoutes } from '../../../../named-routes';
import { AlertService } from '../../alert/alert.service';
import { AuthService } from '../../../../application/auth/auth-service';

@Component({
  selector: 'app-menu-items',
  imports: [MatIconModule],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.scss',
})
export class MenuItems {
  private readonly navController = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService);

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
    { label: 'Sair', icon: 'logout', action: 'logout' },
  ];

  protected readonly selectedRoute = computed(() =>
    this.currentUrl().replace(/^\//, '').split('/')[0] ?? '',
  );

  protected async navigate(item: (typeof this.items)[number]): Promise<void> {
    if (item.action === 'logout') {
      const confirmed = await this.alertService.openAlert({
        message: 'Tem certeza que deseja sair?',
      });

      if (confirmed) {
        await this.authService.logout();
      }

      return;
    }

    if (!item.route) {
      return;
    }

    await this.navController.navigate([item.route]);
  }
}
