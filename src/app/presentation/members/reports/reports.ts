import { Component, inject } from '@angular/core';
import { Summary } from './summary/summary';
import { TypeOfMembers } from './type-of-members/type-of-members';
import { ActiveMembers } from './active-members/active-members';
import { MaritalStatus } from './marital-status/marital-status';
import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { Router } from '@angular/router';
import { namedRoutes } from '../../../named-routes';

@Component({
  selector: 'app-reports',
  imports: [Summary, TypeOfMembers, ActiveMembers, MaritalStatus],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly navController = inject(Router);

  ngOnInit() {
    this.setButtonsActions();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Exibir lista',
        onClick: this.openListMembers,
      },
    ]);
  }

  private readonly openListMembers = (): void => {
    this.navController.navigate([namedRoutes.members]);
  };
}
