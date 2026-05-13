import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { HeaderStore } from '../../application/header/header-store';
import { Header } from '../common/header/header';
import { Menu } from '../common/menu/menu';

@Component({
  selector: 'app-template',
  imports: [Header, RouterOutlet, Menu],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {
  private readonly navController = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly headerStore = inject(HeaderStore);

  private readonly currentTitle = toSignal(
    this.navController.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getCurrentRouteTitle()),
      startWith(this.getCurrentRouteTitle()),
    ),
    { initialValue: this.getCurrentRouteTitle() },
  );

  public constructor() {
    effect(() => {
      this.headerStore.setTitle(this.currentTitle());
    });
  }

  private getCurrentRouteTitle(): string {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return (route.snapshot.data['title'] as string | undefined) ?? 'Igreja';
  }
}
