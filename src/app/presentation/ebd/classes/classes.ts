import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';

import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { Container } from '../../../util/container.service';
import { AlertService } from '../../common/alert/alert.service';
import { ToastService } from '../../common/toast/toast.service';
import { ClassesStore, EbdClass } from '../../../application/ebd/classes-store';
import { CreateClass } from './create-class/create-class';

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
  private readonly alertService = inject(AlertService);
  private readonly toastService = inject(ToastService);
  private readonly classesStore = inject(ClassesStore);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome da classe' },
      { key: 'minAge', header: 'Faixa etária mínima' },
      { key: 'maxAge', header: 'Faixa etária máxima' },
    ];

    this.tableStore.setColumns(columns);

    effect(() => {
      const classes = this.classesStore.getClasses()();
      this.tableStore.setRows(classes.map((ebdClass) => this.toRow(ebdClass)));
    });
  }

  ngOnInit(): void {
    this.setButtonsActions();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  protected hasClasses(): boolean {
    return this.tableStore.hasRows();
  }

  private setButtonsActions(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar classe',
        onClick: this.handleCreateClass,
      },
    ]);
  }

  private readonly handleCreateClass = (): void => {
    this.classesStore.setClassSelected(null);
    this.container.vcr?.createComponent(CreateClass);
  };

  private handleEnterClass(ebdClass: EbdClass): void {
    this.toastService.openToast({
      success: true,
      message: `Entrando na classe ${ebdClass.name}`,
    });
  }

  private handleEditClass(ebdClass: EbdClass): void {
    this.classesStore.setClassSelected(ebdClass);
    this.container.vcr?.createComponent(CreateClass);
  }

  private async handleDeleteClass(ebdClass: EbdClass): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir a classe?',
    });

    if (!confirmed) {
      return;
    }

    this.classesStore.removeClass(ebdClass.id);
  }

  private toRow(ebdClass: EbdClass): TableRow {
    return {
      id: ebdClass.id,
      name: ebdClass.name,
      minAge: `${ebdClass.minAge} anos`,
      maxAge: `${ebdClass.maxAge} anos`,
      actions: [
        {
          key: 'enter',
          icon: 'login',
          label: 'Entrar na classe',
          onClick: () => this.handleEnterClass(ebdClass),
        },
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar classe',
          onClick: () => this.handleEditClass(ebdClass),
        },
        {
          key: 'delete',
          icon: 'delete',
          label: 'Excluir classe',
          onClick: () => this.handleDeleteClass(ebdClass),
        },
      ],
    };
  }
}
