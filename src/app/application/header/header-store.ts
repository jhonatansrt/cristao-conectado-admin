import { Injectable, Signal, signal } from '@angular/core';

import { ButtonClass } from '../../presentation/common/button/button.data';

export interface HeaderButtonAction {
  btnClass: ButtonClass;
  label: string;
  onClick?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderStore {
  private readonly buttonsActions = signal<HeaderButtonAction[]>([]);

  public setButtonsActions(buttonsActions: HeaderButtonAction[]): void {
    this.buttonsActions.set(buttonsActions);
  }

  public clearButtonsActions(): void {
    this.buttonsActions.set([]);
  }

  public getButtonsActions(): Signal<HeaderButtonAction[]> {
    return this.buttonsActions;
  }
}
