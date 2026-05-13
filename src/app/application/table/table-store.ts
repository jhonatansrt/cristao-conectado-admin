import { Injectable, Signal, computed, signal } from '@angular/core';

export type TableValue = string | number | null;

export interface TableAction {
  key: string;
  icon: string;
  label: string;
}

export interface TableColumn<T extends TableRow = TableRow> {
  key: keyof T | string;
  header: string;
}

export interface TableRow {
  id: string | number;
  actions?: TableAction[];
  [key: string]: TableValue | TableAction[] | undefined;
}

export interface TableActionEvent<T extends TableRow = TableRow> {
  actionKey: string;
  rowId: string | number;
  row: T;
}

@Injectable({
  providedIn: 'root',
})
export class TableStore<T extends TableRow = TableRow> {
  private readonly columns = signal<TableColumn<T>[]>([]);
  private readonly rows = signal<T[]>([]);
  private readonly actionEvent = signal<TableActionEvent<T> | null>(null);

  public readonly hasRows = computed(() => this.rows().length > 0);

  public setColumns(columns: TableColumn<T>[]): void {
    this.columns.set(columns);
  }

  public setRows(rows: T[]): void {
    this.rows.set(rows);
  }

  public setTable(columns: TableColumn<T>[], rows: T[]): void {
    this.columns.set(columns);
    this.rows.set(rows);
  }

  public emitAction(event: TableActionEvent<T>): void {
    this.actionEvent.set(event);
  }

  public getColumns(): Signal<TableColumn<T>[]> {
    return this.columns;
  }

  public getRows(): Signal<T[]> {
    return this.rows;
  }

  public getActionEvent(): Signal<TableActionEvent<T> | null> {
    return this.actionEvent;
  }
}
