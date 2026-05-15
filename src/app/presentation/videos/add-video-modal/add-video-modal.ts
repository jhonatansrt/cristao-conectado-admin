import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { CheckboxComponent } from '../../common/checkbox/checkbox';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-add-video-modal',
  imports: [ModalComponent, InputComponent, CheckboxComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-video-modal.html',
  styleUrl: './add-video-modal.scss',
})
export class AddVideoModal {
  private readonly fb = inject(FormBuilder);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly addVideoForm = this.fb.group({
    youtubeUrl: ['', Validators.required],
    title: ['', Validators.required],
    order: ['', [Validators.required, Validators.min(1)]],
    featured: [false],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    if (this.addVideoForm.invalid) {
      this.addVideoForm.markAllAsTouched();
      return;
    }

    this.closeModal();
  }
}
