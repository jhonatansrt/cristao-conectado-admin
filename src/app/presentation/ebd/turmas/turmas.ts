import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { EbdGroupService } from '../../../application/ebd-group/ebd-group.service';
import { EbdClassService } from '../../../application/ebd-class/ebd-class.service';
import { EbdTeacherService } from '../../../application/ebd-teacher/ebd-teacher.service';
import { EbdGroup } from '../../../domain/ebd/entities/ebd-group.entity';
import { CreateTurma, TurmaType } from './create-turma/create-turma';

const API_TYPE_TO_TURMA: Record<EbdGroup['type'], TurmaType> = {
  MAIN: 'principal',
  COMPLEMENTARY: 'complementar',
};

@Component({
  selector: 'app-ebd-turmas',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './turmas.html',
  styleUrl: './turmas.scss',
})
export class Turmas implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly ebdGroupService = inject(EbdGroupService);
  private readonly ebdClassService = inject(EbdClassService);
  private readonly ebdTeacherService = inject(EbdTeacherService);

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome da turma' },
      { key: 'class', header: 'Classe' },
      { key: 'teacher', header: 'Professor responsável' },
      { key: 'schoolYear', header: 'Ano letivo' },
      { key: 'maxStudents', header: 'Limite de alunos' },
      { key: 'type', header: 'Tipo da turma' },
    ];

    this.tableStore.setColumns(columns);
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar turma',
        onClick: this.handleCreateTurma,
      },
    ]);

    this.getTurmas();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private getTurmas(): void {
    this.tableStore.setLoading(true);

    forkJoin({
      groups: this.ebdGroupService.getEbdGroup(),
      classes: this.ebdClassService.getEbdClass(),
      teachers: this.ebdTeacherService.getEbdTeacher(),
    })
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe(({ groups, classes, teachers }) => {
        const classNameById = new Map(classes.map((ebdClass) => [ebdClass.id, ebdClass.name]));
        const teacherNameById = new Map(teachers.map((teacher) => [teacher.id, teacher.name]));

        const rows = groups.map((group) => this.toRow(group, classNameById, teacherNameById));
        this.tableStore.setRows(rows);
      });
  }

  private readonly handleCreateTurma = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTurma);
    componentRef?.instance.ebdGroupSaved.subscribe(() => this.getTurmas());
  };

  private readonly handleEditTurma = (group: EbdGroup): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTurma);
    componentRef?.setInput('turma', {
      id: group.id,
      name: group.name,
      classId: group.class_id,
      teacher: group.teacher_id,
      schoolYear: group.school_year,
      maxStudents: group.student_limit ?? null,
      type: API_TYPE_TO_TURMA[group.type],
    });
    componentRef?.instance.ebdGroupSaved.subscribe(() => this.getTurmas());
  };

  protected hasTurmas(): boolean {
    return this.tableStore.hasRows();
  }

  private toRow(
    group: EbdGroup,
    classNameById: Map<string, string>,
    teacherNameById: Map<string, string>,
  ): TableRow {
    const maxStudents = group.student_limit ?? null;

    return {
      id: group.id,
      name: group.name,
      class: classNameById.get(group.class_id) ?? '—',
      teacher: teacherNameById.get(group.teacher_id) ?? '—',
      schoolYear: String(group.school_year),
      maxStudents: maxStudents === null ? 'Sem limite' : `${maxStudents} alunos`,
      type: API_TYPE_TO_TURMA[group.type] === 'principal' ? 'Principal' : 'Complementar',
      actions: [
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar turma',
          onClick: () => this.handleEditTurma(group),
        },
      ],
    };
  }
}
