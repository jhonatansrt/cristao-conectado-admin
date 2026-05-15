import { Injectable, Signal, computed, signal } from '@angular/core';

export type TableValue = string | number | null;

export interface TableAction {
  key: string;
  icon: string;
  label: string;
  onClick?: () => void;
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


@Injectable({
  providedIn: 'root',
})
export class TableStore<T extends TableRow = TableRow> {
  private readonly columns = signal<TableColumn<T>[]>([]);
  private readonly rows = signal<T[]>([]);
  private readonly loading = signal(false);

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

  public setLoading(loading: boolean): void {
    this.loading.set(loading);
  }


  public getColumns(): Signal<TableColumn<T>[]> {
    return this.columns;
  }

  public getRows(): Signal<T[]> {
    return this.rows;
  }


  public isLoading(): Signal<boolean> {
    return this.loading;
  }
}
