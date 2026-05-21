import { Component, inject } from '@angular/core';

import { ButtonComponent } from '../button/button.component';
import { HeaderStore } from '../../../application/header/header-store';

@Component({
  selector: 'app-footer',
  imports: [ButtonComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly headerStore = inject(HeaderStore);

  protected readonly buttonsActions = this.headerStore.getButtonsActions();
}
