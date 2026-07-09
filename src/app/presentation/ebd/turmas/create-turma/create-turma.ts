import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AutoCompleteComponent, AutoCompleteOption } from '../../../common/auto-complete/auto-complete';
import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { SelectComponent, SelectOption } from '../../../common/select/select';
import { EbdClassService } from '../../../../application/ebd-class/ebd-class.service';
import { EbdGroupService } from '../../../../application/ebd-group/ebd-group.service';
import { MembersService } from '../../../../application/members/members-service';
import { EbdGroupType } from '../../../../domain/ebd/entities/ebd-group.entity';

export type TurmaType = 'principal' | 'complementar';

export const EBD_CLASS_OPTIONS: SelectOption[] = [
  { label: 'Berçário', value: '1' },
  { label: 'Maternal', value: '2' },
  { label: 'Juniores', value: '3' },
  { label: 'Adolescentes', value: '4' },
  { label: 'Jovens', value: '5' },
  { label: 'Adultos', value: '6' },
];

export interface EbdTurmaData {
  id: string;
  name: string;
  classId: string;
  teacher: string;
  schoolYear: number;
  maxStudents: number | null;
  type: TurmaType;
}

const TURMA_TYPE_TO_API: Record<TurmaType, EbdGroupType> = {
  principal: 'MAIN',
  complementar: 'COMPLEMENTARY',
};

@Component({
  selector: 'app-create-turma',
  imports: [
    ModalComponent,
    InputComponent,
    SelectComponent,
    AutoCompleteComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './create-turma.html',
  styleUrl: './create-turma.scss',
})
export class CreateTurma implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ebdGroupService = inject(EbdGroupService);
  private readonly ebdClassService = inject(EbdClassService);
  private readonly membersService = inject(MembersService);

  @Input() public turma?: EbdTurmaData;

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public loading = false;

  protected classOptions: SelectOption[] = [];

  protected teacherOptions: AutoCompleteOption[] = [];

  protected readonly typeOptions: SelectOption[] = [
    { label: 'Principal', value: 'principal' },
    { label: 'Complementar', value: 'complementar' },
  ];

  public readonly form = this.fb.group({
    name: ['', Validators.required],
    classId: ['', Validators.required],
    teacher: ['', Validators.required],
    schoolYear: ['', [Validators.required, Validators.min(2000)]],
    maxStudents: ['', Validators.min(1)],
    type: ['', Validators.required],
  });

  protected get title(): string {
    return this.turma ? 'Editar turma' : 'Adicionar turma';
  }

  ngOnInit(): void {
    this.loadClassOptions();
    this.loadTeacherOptions();

    if (this.turma) {
      this.form.patchValue({
        name: this.turma.name,
        classId: this.turma.classId,
        teacher: this.turma.teacher,
        schoolYear: String(this.turma.schoolYear),
        maxStudents: this.turma.maxStudents === null ? '' : String(this.turma.maxStudents),
        type: this.turma.type,
      });
    }
  }

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, classId, teacher, schoolYear, maxStudents, type } = this.form.getRawValue();

    const props = {
      name: name ?? '',
      class_id: classId ?? '',
      teacher_id: teacher ?? '',
      school_year: Number(schoolYear) || 0,
      student_limit: maxStudents ? Number(maxStudents) : undefined,
      type: TURMA_TYPE_TO_API[type as TurmaType],
    };

    this.loading = true;
    this.ebdGroupService
      .createEbdGroup(props)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.modal?.closeModal();
      });
  }

  private loadClassOptions(): void {
    this.ebdClassService.getEbdClass().subscribe((classes) => {
      this.classOptions = classes.map((ebdClass) => ({ label: ebdClass.name, value: ebdClass.id }));
    });
  }

  private loadTeacherOptions(): void {
    this.membersService.getMembersByChurch().subscribe((members) => {
      this.teacherOptions = members.map((member) => ({ id: member.id, label: member.name }));
    });
  }
}
