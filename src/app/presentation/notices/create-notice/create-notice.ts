import { Component, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { NoticesService } from '../../../application/notices/notices-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-create-notice',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-notice.html',
  styleUrl: './create-notice.scss',
})
export class CreateNotice {
  private readonly fb = inject(FormBuilder);
  private readonly noticesService = inject(NoticesService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public noticeCreated = output<void>();
  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description } = this.form.getRawValue();

    this.loading = true;
    this.noticesService
      .createNotice({
        title: title ?? '',
        description: description ?? '',
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.noticeCreated.emit();
          this.modal?.closeModal();
        },
        error: () => {},
      });
  }
}
