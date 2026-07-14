import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { CreateTurma, EbdTurmaData } from './create-turma/create-turma';
import { EbdGroupService } from '../../../application/ebd-group/ebd-group.service';
import { EbdGroupSelectedStore } from '../../../application/ebd-group/ebd-group-selected-store';
import { EbdGroupListItem } from '../../../domain/ebd/entities/ebd-group.entity';
import { namedRoutes } from '../../../named-routes';

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
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);
  private readonly router = inject(Router);

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

    this.getEbdGroups();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private getEbdGroups(): void {
    this.tableStore.setLoading(true);

    this.ebdGroupService
      .getEbdGroup()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((groups) => {
        this.tableStore.setRows(groups.map((group) => this.toRow(group)));
      });
  }

  private readonly handleCreateTurma = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTurma);
    componentRef?.instance.groupSaved.subscribe(() => this.getEbdGroups());
  };

  private readonly handleEditTurma = (turma: EbdTurmaData): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTurma);
    componentRef?.setInput('turma', turma);
    componentRef?.instance.groupSaved.subscribe(() => this.getEbdGroups());
  };

  private readonly handleEnterTurma = (group: EbdGroupListItem): void => {
    this.ebdGroupSelectedStore.setGroup(group);
    this.router.navigate([namedRoutes.ebd.home, namedRoutes.ebd.turma]);
  };

  protected hasTurmas(): boolean {
    return this.tableStore.hasRows();
  }

  private toTurmaData(group: EbdGroupListItem): EbdTurmaData {
    return {
      id: group.id,
      name: group.name,
      classId: group.class_id,
      teacher: group.teacher_id,
      schoolYear: group.school_year,
      maxStudents: group.student_limit,
      type: group.type === 'MAIN' ? 'principal' : 'complementar',
    };
  }

  private toRow(group: EbdGroupListItem): TableRow {
    const turma = this.toTurmaData(group);

    return {
      id: group.id,
      name: group.name,
      class: group.class_name,
      teacher: group.teacher_name,
      schoolYear: String(group.school_year),
      maxStudents: group.student_limit === null ? 'Sem limite' : `${group.student_limit} alunos`,
      type: group.type === 'MAIN' ? 'Principal' : 'Complementar',
      actions: [
        {
          key: 'enter',
          icon: 'login',
          label: 'Entrar na turma',
          onClick: () => this.handleEnterTurma(group),
        },
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar turma',
          onClick: () => this.handleEditTurma(turma),
        },
      ],
    };
  }
}
