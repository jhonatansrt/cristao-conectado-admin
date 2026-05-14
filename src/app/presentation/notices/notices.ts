import { Component, inject, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { NoticesService } from '../../application/notices/notices-service';

@Component({
  selector: 'app-notices',
  imports: [TableComponent],
  templateUrl: './notices.html',
  styleUrl: './notices.scss',
})
export class Notices implements OnInit {
  private readonly tableStore = inject(TableStore<TableRow>);
  private noticesService = inject(NoticesService);

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
    ];

    this.tableStore.setTable(columns, []);
  }

  public ngOnInit(): void {
    this.noticesService.getNotices().subscribe((rows) => {
      this.tableStore.setRows(rows);
    });
  }
}
