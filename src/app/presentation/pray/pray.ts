import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AlertService } from '../common/alert/alert.service';
import { PrayService } from '../../application/pray/pray-service';
import { CreatePray } from './create-pray/create-pray';

@Component({
  selector: 'app-pray',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './pray.html',
  styleUrl: './pray.scss',
})
export class Pray implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly prayService = inject(PrayService);
  private readonly headerStore = inject(HeaderStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
      { key: 'userName', header: 'Usuário' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.setButtonsActions();
    this.getPray();
  }

  ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar pedido de oração',
        onClick: this.handleCreatePray,
      },
    ]);
  }

  private readonly handleCreatePray = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreatePray);
    componentRef?.instance.prayCreated.subscribe(() => this.getPray());
  };

  private getPray(): void {
    this.tableStore.setLoading(true);

    this.prayService
      .getPray()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((rows) => {
        this.tableStore.setRows(
          rows.map((row) => ({
            ...row,
            actions: row.actions?.map((action) => {
              if (action.key === 'delete') {
                return {
                  ...action,
                  onClick: () => this.handleDeletePray(String(row.id ?? '')),
                };
              }

              return action;
            }),
          })),
        );
      });
  }

  private async handleDeletePray(prayId: string): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o pedido de oração?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    this.prayService
      .deletePray(prayId)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe(() => this.getPray());
  }

  protected hasPray(): boolean {
    return this.tableStore.hasRows();
  }
}
