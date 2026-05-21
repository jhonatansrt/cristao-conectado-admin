import { Component, inject } from '@angular/core';

import { ButtonComponent } from '../button/button.component';
import { ActionBarStore } from '../../../application/action-bar/action-bar-store';

@Component({
  selector: 'app-footer',
  imports: [ButtonComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly actionBarStore = inject(ActionBarStore);

  protected readonly buttonsActions = this.actionBarStore.getButtonsActions();
}
