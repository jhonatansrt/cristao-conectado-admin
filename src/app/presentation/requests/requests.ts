import { Component, inject } from '@angular/core';

import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { ToastService } from '../common/toast/toast.service';

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
  private readonly toastService = inject(ToastService);

  private readonly mockRequests: RequestRow[] = [
    {
      id: 1,
      name: 'Ana Souza',
      email: 'ana.souza@email.com',
      birthDate: '12/08/1998',
    },
    {
      id: 2,
      name: 'Carlos Ferreira',
      email: 'carlos.ferreira@email.com',
      birthDate: '03/11/1989',
    },
    {
      id: 3,
      name: 'Mariana Lima',
      email: 'mariana.lima@email.com',
      birthDate: '25/02/2001',
    },
  ];

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
      { key: 'birthDate', header: 'Data de nascimento' },
    ];

    const rows = this.mockRequests.map((request) => ({
      ...request,
      actions: [
        {
          key: `approve-${request.id}`,
          icon: 'check_circle',
          label: 'Aprovar',
          onClick: () => this.approveRequest(request),
        },
        {
          key: `deny-${request.id}`,
          icon: 'cancel',
          label: 'Negar',
          onClick: () => this.denyRequest(request),
        },
      ],
    }));

    this.tableStore.setTable(columns, rows);
  }

  private approveRequest(request: RequestRow): void {
    this.toastService.openToast({
      message: `${request.name} foi aprovado(a) com sucesso.`,
      success: true,
    });

    this.removeRequest(request.id);
  }

  private denyRequest(request: RequestRow): void {
    this.toastService.openToast({
      message: `Solicitação de ${request.name} negada.`,
    });

    this.removeRequest(request.id);
  }

  private removeRequest(requestId: number | string): void {
    const rows = this.tableStore
      .getRows()()
      .filter((row) => row.id !== requestId);

    this.tableStore.setRows(rows);
  }
}
