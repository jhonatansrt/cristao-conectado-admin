import { Component, inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { NoticesService } from '../../application/notices/notices-service';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';

@Component({
  selector: 'app-notices',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './notices.html',
  styleUrl: './notices.scss',
})
export class Notices implements OnInit {
  private readonly tableStore = inject(TableStore<TableRow>);
  private noticesService = inject(NoticesService);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.getNotices();
  }

  private getNotices(): void {
    this.tableStore.setLoading(true);

    this.noticesService
      .getNotices()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe({
        next: (rows) => {
          this.tableStore.setRows(rows);
        },
        error: () => {},
      });
  }

  protected hasNotices(): boolean {
    return this.tableStore.hasRows();
  }
}
