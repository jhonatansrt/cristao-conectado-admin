import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { EbdEnrollmentService } from '../../../application/ebd-enrollment/ebd-enrollment.service';
import { EbdGroupSelectedStore } from '../../../application/ebd-group/ebd-group-selected-store';
import { EbdEnrollment } from '../../../domain/ebd/entities/ebd-enrollment.entity';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { SegmentComponent, SegmentOption } from '../../common/segment/segment';
import { TableComponent } from '../../common/table/table.component';

type TurmaSection = 'alunos' | 'licoes';

@Component({
  selector: 'app-ebd-turma',
  imports: [SegmentComponent, EmptyCaseComponent, TableComponent],
  templateUrl: './turma.html',
  styleUrl: './turma.scss',
})
export class Turma implements OnInit {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly ebdEnrollmentService = inject(EbdEnrollmentService);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);
  private readonly formatDate = new FormatDatePipe();

  protected readonly options: SegmentOption[] = [
    { label: 'Alunos', value: 'alunos', icon: 'group' },
    { label: 'Lições', value: 'licoes', icon: 'menu_book' },
  ];

  protected readonly selected = signal<TurmaSection>('alunos');
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'enrollmentDate', header: 'Data de matrícula' },
      { key: 'status', header: 'Status' },
      { key: 'name', header: 'Aluno' },
      { key: 'responsibleName', header: 'Responsável' },
    ];

    this.tableStore.setColumns(columns);
  }

  ngOnInit(): void {
    this.getEnrollments();
  }

  protected onSelect(value: string): void {
    this.selected.set(value as TurmaSection);
  }

  protected hasAlunos(): boolean {
    return this.tableStore.hasRows();
  }

  private getEnrollments(): void {
    const group = this.ebdGroupSelectedStore.getGroup()();

    if (!group) {
      this.tableStore.setRows([]);
      return;
    }

    this.tableStore.setLoading(true);

    this.ebdEnrollmentService
      .getEbdEnrollments(group.id)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((enrollments) => {
        this.tableStore.setRows(enrollments.map((enrollment) => this.toRow(enrollment)));
      });
  }

  private toRow(enrollment: EbdEnrollment): TableRow {
    return {
      id: enrollment.id,
      enrollmentDate: this.formatDate.transform(enrollment.enrollment_date),
      status: enrollment.status === 'ACTIVE' ? 'Ativa' : 'Cancelada',
      name: enrollment.name,
      responsibleName: enrollment.responsible_name ?? '-',
    };
  }
}
