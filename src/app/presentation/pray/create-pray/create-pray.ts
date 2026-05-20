import { Component, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { PrayService } from '../../../application/pray/pray-service';

@Component({
  selector: 'app-create-pray',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-pray.html',
  styleUrl: './create-pray.scss',
})
export class CreatePray {
  private readonly fb = inject(FormBuilder);
  private readonly prayService = inject(PrayService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public prayCreated = output<void>();
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
    this.prayService
      .createPray({
        title: title ?? '',
        description: description ?? '',
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.prayCreated.emit();
        this.modal?.closeModal();
      });
  }
}
