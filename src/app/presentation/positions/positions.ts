import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Container } from '../../util/container.service';
import { CreatePosition } from './create-position/create-position';
import { AlertService } from '../common/alert/alert.service';
import { Position } from '../../domain/positions';
import { PositionsService } from '../../application/positions/positions-service';
import { PositionsStore } from '../../application/positions/positions-store';

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
  private readonly positionsService = inject(PositionsService);
  private readonly positionsStore = inject(PositionsStore);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [{ key: 'name', header: 'Cargo' }];

    this.tableStore.setColumns(columns);

    effect(() => {
      const positions = this.positionsStore.getPositions()();
      this.tableStore.setRows(positions.map((position) => this.toRow(position)));
    });
  }

  ngOnInit(): void {
    this.setButtonsActions();
    this.loadPositions();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  public getPositions(): void {
    this.tableStore.setLoading(true);

    this.positionsService.getPositions().subscribe({
      next: (positions) => {
        const rows = positions.map((pos) => this.positionToRow(pos));
        this.tableStore.setRows(rows);
        this.tableStore.setLoading(false);
      },
      error: () => {
        this.tableStore.setLoading(false);
      },
    });
  }

  private positionToRow(position: any): TableRow {
    return {
      id: position.id,
      name: position.name,
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
    };
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
    this.positionsStore.setPositionSelected(null);
    this.container.vcr?.createComponent(CreatePosition);
  };

  private handleEditPosition(position: Position): void {
    this.positionsStore.setPositionSelected(position);
    this.container.vcr?.createComponent(CreatePosition);
  }

  private async handleDeletePosition(position: Position): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o cargo?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    // this.positionsService
    //   .deletePosition(position.id)
    //   .pipe(finalize(() => this.tableStore.setLoading(false)))
    //   .subscribe();
  }

  private loadPositions(): void {
    this.tableStore.setLoading(true);

    this.positionsService
      .loadPositions()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe();
  }

  private toRow(position: Position): TableRow {
    return {
      id: position.id,
      name: position.name,
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
    };
  }
}
