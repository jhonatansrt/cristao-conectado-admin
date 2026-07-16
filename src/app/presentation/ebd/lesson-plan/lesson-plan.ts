import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { namedRoutes } from '../../../named-routes';

@Component({
  selector: 'app-ebd-lesson-plan',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './lesson-plan.html',
  styleUrl: './lesson-plan.scss',
})
export class LessonPlan implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly router = inject(Router);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly columns: TableColumn[] = [
    { key: 'name', header: 'Nome' },
    { key: 'period', header: 'Período' },
  ];

  // TODO: substituir pelos dados reais do plano de lições quando a API estiver disponível.
  private readonly mockPlans: { id: number; name: string; period: string }[] = [
    { id: 1, name: 'Plano de lições - 1º Trimestre', period: '01/01/2026 a 31/03/2026' },
    { id: 2, name: 'Plano de lições - 2º Trimestre', period: '01/04/2026 a 30/06/2026' },
    { id: 3, name: 'Plano de lições - 3º Trimestre', period: '01/07/2026 a 30/09/2026' },
  ];

  constructor() {
    this.tableStore.setColumns(this.columns);
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar plano de lições',
        onClick: this.handleCreatePlan,
      },
    ]);

    this.tableStore.setRows(this.mockPlans.map((plan) => this.toRow(plan)));
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
    this.tableStore.setRows([]);
  }

  protected hasRows(): boolean {
    return this.tableStore.hasRows();
  }

  private toRow(plan: { id: number; name: string; period: string }): TableRow {
    return {
      id: plan.id,
      name: plan.name,
      period: plan.period,
      actions: [
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar plano de lições',
          onClick: () => this.handleEditPlan(plan.id),
        },
        {
          key: 'lessons',
          icon: 'menu_book',
          label: 'Ver lições',
          onClick: () => this.handleViewLessons(plan.id),
        },
        {
          key: 'enter',
          icon: 'chevron_right',
          label: 'Entrar no plano de lições',
          onClick: () => this.handleEnterPlan(plan.id),
        },
      ],
    };
  }

  private readonly handleCreatePlan = (): void => {
    // TODO: abrir o formulário de criação do plano de lições.
  };

  private handleEditPlan(id: number): void {
    // TODO: abrir o formulário de edição do plano de lições.
    void id;
  }

  private handleViewLessons(id: number): void {
    // TODO: usar o id do plano de lições selecionado ao carregar as lições.
    void id;
    this.router.navigate([namedRoutes.ebd.home, namedRoutes.ebd.turma], {
      queryParams: { section: 'licoes' },
    });
  }

  private handleEnterPlan(id: number): void {
    // TODO: usar o id do plano de lições selecionado ao carregar a turma.
    void id;
    this.router.navigate([namedRoutes.ebd.home, namedRoutes.ebd.turma]);
  }
}
