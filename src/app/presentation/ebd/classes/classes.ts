import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { CreateClass } from './create-class/create-class';
import { EbdClassService } from '../../../application/ebd-class/ebd-class.service';
import { finalize } from 'rxjs';
import { EbdClass } from '../../../domain/ebd/entities/ebd-class.entity';

@Component({
  selector: 'app-ebd-classes',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './classes.html',
  styleUrl: './classes.scss',
})
export class Classes implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly ebdClassService = inject(EbdClassService);

  private readonly classes: EbdClass[] = [];

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
        onClick: this.handleCreateClass,
      },
    ]);

    this.getEbdClass();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private getEbdClass(): void {
    this.tableStore.setLoading(true);

    this.ebdClassService
      .getEbdClass()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((classes) => {
        const rows = classes.map((ebdClass) => this.toRow(ebdClass));
        this.tableStore.setRows(rows);
      });
  }

  private readonly handleCreateClass = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateClass);
    componentRef?.instance.ebdClassCreated.subscribe(() => this.getEbdClass());
  };

  private readonly handleEditClass = (ebdClass: EbdClass): void => {
    const componentRef = this.container.vcr?.createComponent(CreateClass);
    componentRef?.setInput('ebdClass', ebdClass);
    componentRef?.instance.ebdClassCreated.subscribe(() => this.getEbdClass());
  };

  protected hasClasses(): boolean {
    return this.tableStore.hasRows();
  }

  private readonly toRow = (ebdClass: EbdClass): TableRow => {
    return {
      id: ebdClass.id,
      name: ebdClass.name,
      minAge: `${ebdClass.min_age} anos`,
      maxAge: `${ebdClass.max_age} anos`,
      actions: [
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar classe',
          onClick: () => this.handleEditClass(ebdClass),
        },
      ],
    };
  };
}
