import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Container } from '../../util/container.service';
import { CreatePosition, PositionCreated } from './create-position/create-position';
import { AlertService } from '../common/alert/alert.service';

interface Position {
  id: string;
  name: string;
  membersCount: number;
}

@Component({
  selector: 'app-positions',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './positions.html',
  styleUrl: './positions.scss',
})
export class Positions implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  protected readonly isLoading = this.tableStore.isLoading();

  private positions: Position[] = [
    { id: '1', name: 'Pastor', membersCount: 2 },
    { id: '2', name: 'Líder de louvor', membersCount: 5 },
    { id: '3', name: 'Diácono', membersCount: 8 },
    { id: '4', name: 'Voluntário de mídia', membersCount: 12 },
  ];

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Cargo' },
      { key: 'membersCount', header: 'Quantidade de pessoas' },
    ];

    this.tableStore.setColumns(columns);
  }

  ngOnInit(): void {
    this.setButtonsActions();
    this.loadPositions();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  protected hasPositions(): boolean {
    return this.tableStore.hasRows();
  }

  private setButtonsActions(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar cargo',
        onClick: this.handleCreatePosition,
      },
    ]);
  }

  private readonly handleCreatePosition = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreatePosition);
    componentRef?.instance.positionCreated.subscribe((position) => this.onPositionCreated(position));
  };

  private handleEditPosition(position: Position): void {
    const componentRef = this.container.vcr?.createComponent(CreatePosition);
    componentRef?.setInput('registerId', position.id);
    componentRef?.setInput('initialName', position.name);
    componentRef?.instance.positionCreated.subscribe((result) => this.onPositionCreated(result));
  }

  private async handleDeletePosition(position: Position): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o cargo?',
    });

    if (!confirmed) {
      return;
    }

    this.positions = this.positions.filter((item) => item.id !== position.id);
    this.loadPositions();
  }

  private onPositionCreated(result: PositionCreated): void {
    if (result.id) {
      this.positions = this.positions.map((item) =>
        item.id === result.id ? { ...item, name: result.name } : item,
      );
    } else {
      this.positions = [
        ...this.positions,
        { id: crypto.randomUUID(), name: result.name, membersCount: 0 },
      ];
    }

    this.loadPositions();
  }

  private loadPositions(): void {
    this.tableStore.setRows(
      this.positions.map((position) => ({
        id: position.id,
        name: position.name,
        membersCount: position.membersCount,
        actions: [
          {
            key: 'edit',
            icon: 'edit',
            label: 'Editar cargo',
            onClick: () => this.handleEditPosition(position),
          },
          {
            key: 'delete',
            icon: 'delete',
            label: 'Excluir cargo',
            onClick: () => this.handleDeletePosition(position),
          },
        ],
      })),
    );
  }
}
