import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { NoticesService } from '../../application/notices/notices-service';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../application/action-bar/action-bar-store';
import { Container } from '../../util/container.service';
import { CreateNotice } from './create-notice/create-notice';
import { AlertService } from '../common/alert/alert.service';

@Component({
  selector: 'app-notices',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './notices.html',
  styleUrl: './notices.scss',
})
export class Notices implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly noticesService = inject(NoticesService);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.setButtonsActions();
    this.getNotices();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar aviso',
        onClick: this.handleCreateNotice,
      },
    ]);
  }

  private readonly handleCreateNotice = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateNotice);
    componentRef?.instance.noticeCreated.subscribe(() => this.getNotices());
  };

  private getNotices(): void {
    this.tableStore.setLoading(true);

    this.noticesService
      .getNotices()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((rows) => {
        this.tableStore.setRows(
          rows.map((row) => ({
            ...row,
            actions: row.actions?.map((action) => {
              if (action.key === 'edit') {
                return {
                  ...action,
                  onClick: () => this.handleEditNotice(row),
                };
              }

              if (action.key === 'delete') {
                return {
                  ...action,
                  onClick: () => this.handleDeleteNotice(String(row.id ?? '')),
                };
              }

              return action;
            }),
          })),
        );
      });
  }

  private async handleDeleteNotice(noticeId: string): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o aviso?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    this.noticesService
      .deleteNotice(noticeId)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe(() => this.getNotices());
  }

  private handleEditNotice(row: TableRow): void {
    const componentRef = this.container.vcr?.createComponent(CreateNotice);
    componentRef?.setInput('registerId', String(row.id ?? ''));
    componentRef?.setInput('initialTitle', String(row['title'] ?? ''));
    componentRef?.setInput('initialDescription', String(row['description'] ?? ''));
    componentRef?.instance.noticeCreated.subscribe(() => this.getNotices());
  }

  protected hasNotices(): boolean {
    return this.tableStore.hasRows();
  }
}
