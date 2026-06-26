import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';

interface EbdClass {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

@Component({
  selector: 'app-ebd-classes',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly classes: EbdClass[] = [
    { id: '1', name: 'Berçário', minAge: 0, maxAge: 3 },
    { id: '2', name: 'Maternal', minAge: 4, maxAge: 6 },
    { id: '3', name: 'Juniores', minAge: 7, maxAge: 10 },
    { id: '4', name: 'Adolescentes', minAge: 11, maxAge: 14 },
    { id: '5', name: 'Jovens', minAge: 15, maxAge: 24 },
    { id: '6', name: 'Adultos', minAge: 25, maxAge: 120 },
  ];

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome da classe' },
      { key: 'minAge', header: 'Faixa etária mínima' },
      { key: 'maxAge', header: 'Faixa etária máxima' },
    ];

    this.tableStore.setColumns(columns);
    this.tableStore.setRows(this.classes.map((ebdClass) => this.toRow(ebdClass)));
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar classe',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  protected hasClasses(): boolean {
    return this.tableStore.hasRows();
  }

  private toRow(ebdClass: EbdClass): TableRow {
    return {
      id: ebdClass.id,
      name: ebdClass.name,
      minAge: `${ebdClass.minAge} anos`,
      maxAge: `${ebdClass.maxAge} anos`,
    };
  }
}
