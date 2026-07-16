import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { EbdEnrollmentService } from '../../../application/ebd-enrollment/ebd-enrollment.service';
import { EbdLessonService } from '../../../application/ebd-lesson/ebd-lesson.service';
import { EbdGroupSelectedStore } from '../../../application/ebd-group/ebd-group-selected-store';
import { EbdEnrollment } from '../../../domain/ebd/entities/ebd-enrollment.entity';
import { EbdLesson } from '../../../domain/ebd/entities/ebd-lesson.entity';
import { CapitalizeNamePipe } from '../../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { Container } from '../../../util/container.service';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { SegmentComponent, SegmentOption } from '../../common/segment/segment';
import { TableComponent } from '../../common/table/table.component';
import { CreateEnrollment } from './create-enrollment/create-enrollment';
import { CreateLesson, EbdLessonData } from './create-lesson/create-lesson';

type TurmaSection = 'alunos' | 'licoes';

@Component({
  selector: 'app-ebd-turma',
  imports: [SegmentComponent, EmptyCaseComponent, TableComponent],
  templateUrl: './turma.html',
  styleUrl: './turma.scss',
})
export class Turma implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  private readonly ebdEnrollmentService = inject(EbdEnrollmentService);
  private readonly ebdLessonService = inject(EbdLessonService);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);
  private readonly route = inject(ActivatedRoute);
  private readonly formatDate = new FormatDatePipe();
  private readonly capitalizeName = new CapitalizeNamePipe();

  private readonly enrollmentColumns: TableColumn[] = [
    { key: 'name', header: 'Aluno' },
    { key: 'enrollmentDate', header: 'Data de matrícula' },
    { key: 'status', header: 'Status' },
    { key: 'responsibleName', header: 'Responsável' },
  ];

  private readonly lessonColumns: TableColumn[] = [
    { key: 'title', header: 'Lição' },
    { key: 'done', header: 'Realizada' },
    { key: 'displayOrder', header: 'Ordem de exibição' },
  ];

  protected readonly options: SegmentOption[] = [
    { label: 'Alunos', value: 'alunos', icon: 'group' },
    { label: 'Lições', value: 'licoes', icon: 'menu_book' },
  ];

  protected readonly selected = signal<TurmaSection>('alunos');
  protected readonly isLoading = this.tableStore.isLoading();

  // Dados completos das lições (passages, images, pdfs, videos) mantidos para uso futuro.
  protected readonly lessons = signal<EbdLesson[]>([]);

  ngOnInit(): void {
    const section = this.route.snapshot.queryParamMap.get('section');

    if (section === 'licoes') {
      this.selected.set('licoes');
      this.setActionBarButton();
      this.getLessons();
      return;
    }

    this.setActionBarButton();
    this.getEnrollments();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  protected onSelect(value: string): void {
    const section = value as TurmaSection;
    this.selected.set(section);
    this.setActionBarButton();

    if (section === 'licoes') {
      this.getLessons();
      return;
    }

    this.getEnrollments();
  }

  private setActionBarButton(): void {
    if (this.selected() === 'licoes') {
      this.actionBarStore.setButtonsActions([
        {
          btnClass: 'btn-primary',
          label: 'Adicionar lição',
          onClick: this.handleCreateLesson,
        },
      ]);
      return;
    }

    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Matricular aluno',
        onClick: this.handleCreateEnrollment,
      },
    ]);
  }

  private readonly handleCreateEnrollment = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateEnrollment);
    componentRef?.instance.enrollmentCreated.subscribe(() => this.getEnrollments());
  };

  private readonly handleCreateLesson = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateLesson);
    componentRef?.instance.lessonSaved.subscribe(() => this.getLessons());
  };

  private readonly handleEditLesson = (lesson: EbdLessonData): void => {
    const componentRef = this.container.vcr?.createComponent(CreateLesson);
    componentRef?.setInput('lesson', lesson);
    componentRef?.instance.lessonSaved.subscribe(() => this.getLessons());
  };

  protected hasRows(): boolean {
    return this.tableStore.hasRows();
  }

  private getEnrollments(): void {
    const group = this.ebdGroupSelectedStore.getGroup()();

    if (!group) {
      this.tableStore.setTable(this.enrollmentColumns, []);
      return;
    }

    this.tableStore.setColumns(this.enrollmentColumns);
    this.tableStore.setLoading(true);

    this.ebdEnrollmentService
      .getEbdEnrollments(group.id)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((enrollments) => {
        this.tableStore.setRows(enrollments.map((enrollment) => this.toEnrollmentRow(enrollment)));
      });
  }

  private getLessons(): void {
    const group = this.ebdGroupSelectedStore.getGroup()();

    if (!group) {
      this.lessons.set([]);
      this.tableStore.setTable(this.lessonColumns, []);
      return;
    }

    this.tableStore.setColumns(this.lessonColumns);
    this.tableStore.setLoading(true);

    this.ebdLessonService
      .getEbdLessons(group.id)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((lessons) => {
        this.lessons.set(lessons);
        this.tableStore.setRows(lessons.map((lesson) => this.toLessonRow(lesson)));
      });
  }

  private toEnrollmentRow(enrollment: EbdEnrollment): TableRow {
    return {
      id: enrollment.id,
      enrollmentDate: this.formatDate.transform(enrollment.enrollment_date),
      status: enrollment.status === 'ACTIVE' ? 'Ativa' : 'Cancelada',
      name: this.capitalizeName.transform(enrollment.name),
      responsibleName: this.capitalizeName.transform(enrollment.responsible_name),
    };
  }

  private toLessonRow(lesson: EbdLesson): TableRow {
    return {
      id: lesson.id,
      displayOrder: lesson.display_order,
      title: lesson.title,
      done: lesson.done ? 'Sim' : 'Não',
      actions: [
        {
          key: 'edit',
          icon: 'edit',
          label: 'Editar lição',
          onClick: () => this.handleEditLesson(this.toLessonData(lesson)),
        },
      ],
    };
  }

  private toLessonData(lesson: EbdLesson): EbdLessonData {
    return {
      id: lesson.id,
      title: lesson.title,
      displayOrder: lesson.display_order,
      done: lesson.done,
    };
  }
}
