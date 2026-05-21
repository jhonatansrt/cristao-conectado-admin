import { Injectable, Signal, signal } from '@angular/core';

import { ButtonClass } from '../../presentation/common/button/button.data';

export interface ActionBarButtonAction {
  btnClass: ButtonClass;
  label: string;
  onClick?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ActionBarStore {
  private readonly buttonsActions = signal<ActionBarButtonAction[]>([]);

  public setButtonsActions(buttonsActions: ActionBarButtonAction[]): void {
    this.buttonsActions.set(buttonsActions);
  }

  public clearButtonsActions(): void {
    this.buttonsActions.set([]);
  }

  public getButtonsActions(): Signal<ActionBarButtonAction[]> {
    return this.buttonsActions;
  }
}
