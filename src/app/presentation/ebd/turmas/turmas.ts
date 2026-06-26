import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { CreateTurma, TurmaType } from './create-turma/create-turma';

interface EbdTurma {
  id: string;
  name: string;
  teacher: string;
  schoolYear: number;
  maxStudents: number | null;
  type: TurmaType;
}

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

  private readonly turmas: EbdTurma[] = [
    {
      id: '1',
      name: 'Adultos - Manhã',
      teacher: 'Pr. João Silva',
      schoolYear: 2026,
      maxStudents: 30,
      type: 'principal',
    },
    {
      id: '2',
      name: 'Jovens - Manhã',
      teacher: 'Maria Oliveira',
      schoolYear: 2026,
      maxStudents: 25,
      type: 'principal',
    },
    {
      id: '3',
      name: 'Música',
      teacher: 'Lucas Pereira',
      schoolYear: 2026,
      maxStudents: null,
      type: 'complementar',
    },
    {
      id: '4',
      name: 'Discipulado',
      teacher: 'Ana Costa',
      schoolYear: 2026,
      maxStudents: 15,
      type: 'complementar',
    },
    {
      id: '5',
      name: 'Teologia Básica',
      teacher: 'Pr. Pedro Santos',
      schoolYear: 2026,
      maxStudents: null,
      type: 'complementar',
    },
  ];

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome da turma' },
      { key: 'teacher', header: 'Professor responsável' },
      { key: 'schoolYear', header: 'Ano letivo' },
      { key: 'maxStudents', header: 'Limite de alunos' },
      { key: 'type', header: 'Tipo da turma' },
    ];

    this.tableStore.setColumns(columns);
    this.tableStore.setRows(this.turmas.map((turma) => this.toRow(turma)));
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar turma',
        onClick: this.handleCreateTurma,
      },
    ]);
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private readonly handleCreateTurma = (): void => {
    this.container.vcr?.createComponent(CreateTurma);
  };

  private readonly handleEditTurma = (turma: EbdTurma): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTurma);
    componentRef?.setInput('turma', turma);
  };

  protected hasTurmas(): boolean {
    return this.tableStore.hasRows();
  }

  private toRow(turma: EbdTurma): TableRow {
    return {
      id: turma.id,
      name: turma.name,
      teacher: turma.teacher,
      schoolYear: String(turma.schoolYear),
      maxStudents: turma.maxStudents === null ? 'Sem limite' : `${turma.maxStudents} alunos`,
      type: turma.type === 'principal' ? 'Principal' : 'Complementar',
      actions: [
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
