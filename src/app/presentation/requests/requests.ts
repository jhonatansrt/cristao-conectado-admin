import { Component, inject } from '@angular/core';

import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { RequestsService } from '../../application/requests/requests-service';
import { UserChurchRequest } from '../../domain/requests';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { TableComponent } from '../common/table/table.component';
import { ToastService } from '../common/toast/toast.service';
import { AlertService } from '../common/alert/alert.service';

interface RequestRow extends TableRow {
  name: string;
  email: string;
  birthDate: string;
}

@Component({
  selector: 'app-requests',
  imports: [TableComponent],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly requestsService = inject(RequestsService);
  private readonly toastService = inject(ToastService);
  private readonly alertService = inject(AlertService);
  private readonly capitalizeNamePipe = new CapitalizeNamePipe();
  private readonly formatDatePipe = new FormatDatePipe();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
      { key: 'birthDate', header: 'Data de nascimento' },
    ];

    this.tableStore.setColumns(columns);
    this.loadPendingRequests();
  }

  private loadPendingRequests(): void {
    this.tableStore.setLoading(true);

    this.requestsService.getPendingRequestsByChurch().subscribe({
      next: (requests) => {
        const rows = requests.map((request) => this.buildRow(request));
        this.tableStore.setRows(rows);
        this.tableStore.setLoading(false);
      },
      error: () => {
        this.tableStore.setLoading(false);
      },
    });
  }

  private buildRow(request: UserChurchRequest): RequestRow {
    const name = this.capitalizeNamePipe.transform(request.name);
    const email = request.email;
    const birthDate = this.formatDatePipe.transform(request.birth_date);

    return {
      id: request.id,
      name,
      email,
      birthDate,
      actions: [
        {
          key: `approve-${request.id}`,
          icon: 'check_circle',
          label: 'Aprovar',
          onClick: () => this.approveRequest({ id: request.id, name, email, birthDate }),
        },
        {
          key: `deny-${request.id}`,
          icon: 'cancel',
          label: 'Negar',
          onClick: () => this.denyRequest({ id: request.id, name, email, birthDate }),
        },
      ],
    };
  }

  private approveRequest(request: RequestRow): void {
    this.requestsService.reviewRequest({ id: String(request.id), status: 1 }).subscribe({
      next: () => {
        this.toastService.openToast({
          message: `${request.name} foi aprovado(a) com sucesso.`,
          success: true,
        });

        this.removeRequest(request.id);
      },
    });
  }

  private async denyRequest(request: RequestRow): Promise<void> {
    const isConfirmed = await this.alertService.openAlert({
      message: `Tem certeza que deseja recusar a solicitação de ${request.name}?`,
    });

    if (!isConfirmed) {
      return;
    }

    this.requestsService.reviewRequest({ id: String(request.id), status: 2 }).subscribe({
      next: () => {
        this.toastService.openToast({
          message: `Solicitação de ${request.name} negada.`,
        });

        this.removeRequest(request.id);
      },
    });
  }

  private removeRequest(requestId: number | string): void {
    const rows = this.tableStore
      .getRows()()
      .filter((row) => row.id !== requestId);

    this.tableStore.setRows(rows);
  }
}
