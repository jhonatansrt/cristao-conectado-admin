import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { MembersService } from '../../application/members/members-service';
import { MemberTransform } from '../../infrastructure/members/member-transform';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Router } from '@angular/router';
import { namedRoutes } from '../../named-routes';
import { Member } from '../../domain/members';
import { AlertService } from '../common/alert/alert.service';
import { Container } from '../../util/container.service';
import { CreateMember } from './create-member/create-member';

@Component({
  selector: 'app-members',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly membersService = inject(MembersService);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly navController = inject(Router);
  private readonly alertService = inject(AlertService);
  private readonly container = inject(Container);
  protected readonly isLoading = this.tableStore.isLoading();
  protected readonly hasMembers = this.tableStore.hasRows;

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
      { key: 'birthDate', header: 'Data de nascimento' },
      { key: 'maritalStatus', header: 'Estado Civil' },
      { key: 'is_active', header: 'Ativo' },
      { key: 'is_baptized', header: 'Batizado' },
      { key: 'type', header: 'Tipo'},
      { key: 'position', header: 'Cargo' },
    ];

    this.tableStore.setColumns(columns);
  }

  ngOnInit() {
    this.setButtonsActions();
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Exibir relatórios',
        onClick: this.openSummary,
      },
    ]);
  }

  private readonly openSummary = (): void => {
    this.navController.navigate([namedRoutes.membersReports]);
  };

  private loadMembers(): void {
    this.tableStore.setLoading(true);

    this.membersService.getMembersByChurch().subscribe({
      next: (members) => {
        const rows = members.map((member) => ({
          ...MemberTransform.toRow(member),
          actions: [
            {
              key: 'edit',
              icon: 'edit',
              label: 'Editar membro',
              onClick: () => this.handleEditMember(member),
            },
            {
              key: 'delete',
              icon: 'delete',
              label: 'Excluir membro',
              onClick: () => this.handleDeleteMember(member),
            },
          ],
        }));

        this.tableStore.setRows(rows);
        this.tableStore.setLoading(false);
      },
      error: () => {
        this.tableStore.setLoading(false);
      },
    });
  }

  private handleEditMember(member: Member): void {
    const componentRef = this.container.vcr?.createComponent(CreateMember);

    if (componentRef){
      componentRef.instance.member = member;
    }
  }

  private async handleDeleteMember(member: Member): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o membro?',
    });

    if (!confirmed) {
      return;
    }

    //this.tableStore.setLoading(true);

    // this.positionsService
    //   .deletePosition(position.id)
    //   .pipe(finalize(() => this.tableStore.setLoading(false)))
    //   .subscribe();
  }
}
