import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { SelectComponent, SelectOption } from '../../../common/select/select';

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

@Component({
  selector: 'app-create-turma',
  imports: [ModalComponent, InputComponent, SelectComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-turma.html',
  styleUrl: './create-turma.scss',
})
export class CreateTurma implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input() public turma?: EbdTurmaData;

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  protected readonly classOptions = EBD_CLASS_OPTIONS;

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Mock: nenhuma integração por enquanto, apenas fecha o modal.
    this.modal?.closeModal();
  }
}
