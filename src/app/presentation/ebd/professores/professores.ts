import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { CreateTeacher, EbdTeacherCreated } from './create-teacher/create-teacher';

@Component({
  selector: 'app-ebd-professores',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './professores.html',
  styleUrl: './professores.scss',
})
export class Professores implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly teachers: EbdTeacherCreated[] = [];

  constructor() {
    const columns: TableColumn[] = [{ key: 'name', header: 'Nome do professor' }];

    this.tableStore.setColumns(columns);
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar professor',
        onClick: this.handleCreateTeacher,
      },
    ]);
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private readonly handleCreateTeacher = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTeacher);
    componentRef?.instance.teacherCreated.subscribe((teacher) => {
      this.teachers.push(teacher);
      this.tableStore.setRows(this.teachers.map((t) => ({ id: t.id, name: t.memberName })));
    });
  };

  protected hasTeachers(): boolean {
    return this.tableStore.hasRows();
  }
}
