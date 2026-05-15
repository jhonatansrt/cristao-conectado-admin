import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TableAction, TableRow, TableStore } from '../../../application/table/table-store';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-table',
  imports: [MatIconModule, SkeletonComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
})
export class TableComponent {
  private readonly tableStore = inject(TableStore<TableRow>);

  public readonly columns = this.tableStore.getColumns();
  public readonly rows = this.tableStore.getRows();
  public readonly isLoading = this.tableStore.isLoading();

  public handleActionClick(action: TableAction, row: TableRow): void {
    this.tableStore.emitAction({
      actionKey: action.key,
      rowId: row.id,
      row,
    });
  }
}
