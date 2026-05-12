import { Component, inject } from '@angular/core';

import { HeaderStore } from '../../../application/header/header-store';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly headerStore = inject(HeaderStore);

  protected readonly title = this.headerStore.getTitle();
}
