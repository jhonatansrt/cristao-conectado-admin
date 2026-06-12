import { Component, OnInit, ViewChild, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

export interface PositionCreated {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-create-position',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-position.html',
  styleUrl: './create-position.scss',
})
export class CreatePosition implements OnInit {
  private readonly fb = inject(FormBuilder);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public positionCreated = output<PositionCreated>();
  public readonly registerId = input<string>();
  public readonly initialName = input<string>('');

  public readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.form.patchValue({ name: this.initialName() });
  }

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();

    this.positionCreated.emit({ id: this.registerId(), name: name ?? '' });
    this.modal?.closeModal();
  }
}
