import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';

@Component({
  selector: 'app-create-class',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.scss',
})
export class CreateClass {
  private readonly fb = inject(FormBuilder);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly form = this.fb.group({
    name: ['', Validators.required],
    minAge: ['', [Validators.required, Validators.min(0)]],
    maxAge: ['', [Validators.required, Validators.min(0)]],
  });

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
