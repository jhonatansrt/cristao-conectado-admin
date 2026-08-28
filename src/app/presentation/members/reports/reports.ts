import { Component, inject } from '@angular/core';
import { Summary } from './summary/summary';
import { TypeOfMembers } from './type-of-members/type-of-members';
import { ActiveMembers } from './active-members/active-members';
import { MaritalStatusChart } from './marital-status/marital-status';
import { RoleDistribution } from './role-distribution/role-distribution';
import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { Router } from '@angular/router';
import { namedRoutes } from '../../../named-routes';
import { MembersService } from '../../../application/members/members-service';
import { ReportDataMemberDTO } from '../../../domain/members';

@Component({
  selector: 'app-reports',
  imports: [Summary, TypeOfMembers, ActiveMembers, MaritalStatusChart, RoleDistribution],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly navController = inject(Router);
  private readonly membersService = inject(MembersService);
  protected reportData: ReportDataMemberDTO | null = null;

  constructor() {
    this.loadReportData();
  }

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

  loadReportData() {
    this.membersService.getMembersReport().subscribe((data) => {
      this.reportData = data;
    });
  } 
}
