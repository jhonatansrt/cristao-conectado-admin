import { Component, inject } from '@angular/core';

import { HeaderStore } from '../../../application/header/header-store';
import { MenuStore } from '../../../application/menu/menu-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly headerStore = inject(HeaderStore);
  private readonly menuStore = inject(MenuStore);

  protected readonly title = this.headerStore.getTitle();

  protected toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuStore.toggle();
  }
}
