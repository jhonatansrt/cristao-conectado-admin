import { Component, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { EbdLessonService } from '../../../../application/ebd-lesson/ebd-lesson.service';
import { EbdGroupSelectedStore } from '../../../../application/ebd-group/ebd-group-selected-store';

@Component({
  selector: 'app-create-lesson',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-lesson.html',
  styleUrl: './create-lesson.scss',
})
export class CreateLesson {
  private readonly fb = inject(FormBuilder);
  private readonly ebdLessonService = inject(EbdLessonService);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);

  public lessonCreated = output<void>();

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    displayOrder: ['', [Validators.required, Validators.min(1)]],
  });

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const groupId = this.ebdGroupSelectedStore.getGroup()()?.id;

    if (!groupId) {
      return;
    }

    const { title, displayOrder } = this.form.getRawValue();

    this.loading = true;
    this.ebdLessonService
      .createEbdLesson(groupId, title ?? '', Number(displayOrder) || 0)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.lessonCreated.emit();
        this.modal?.closeModal();
      });
  }
}
