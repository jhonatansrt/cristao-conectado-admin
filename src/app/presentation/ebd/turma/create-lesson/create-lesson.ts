import { Component, Input, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { EbdLessonService } from '../../../../application/ebd-lesson/ebd-lesson.service';
import { EbdGroupSelectedStore } from '../../../../application/ebd-group/ebd-group-selected-store';

export interface EbdLessonData {
  id: string;
  title: string;
  displayOrder: number;
  done: boolean;
}

@Component({
  selector: 'app-create-lesson',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-lesson.html',
  styleUrl: './create-lesson.scss',
})
export class CreateLesson implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ebdLessonService = inject(EbdLessonService);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);

  @Input() public lesson?: EbdLessonData;

  public lessonSaved = output<void>();

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    displayOrder: ['', [Validators.required, Validators.min(1)]],
  });

  protected get title(): string {
    return this.lesson ? 'Editar lição' : 'Adicionar lição';
  }

  ngOnInit(): void {
    if (this.lesson) {
      this.form.patchValue({
        title: this.lesson.title,
        displayOrder: String(this.lesson.displayOrder),
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

    const { title, displayOrder } = this.form.getRawValue();

    this.loading = true;

    if (this.lesson) {
      this.ebdLessonService
        .updateEbdLesson(this.lesson.id, title ?? '', Number(displayOrder) || 0, this.lesson.done)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => {
          this.lessonSaved.emit();
          this.modal?.closeModal();
        });
      return;
    }

    const groupId = this.ebdGroupSelectedStore.getGroup()()?.id;

    if (!groupId) {
      this.loading = false;
      return;
    }

    this.ebdLessonService
      .createEbdLesson(groupId, title ?? '', Number(displayOrder) || 0)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.lessonSaved.emit();
        this.modal?.closeModal();
      });
  }
}
