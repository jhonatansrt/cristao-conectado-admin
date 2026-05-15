import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-add-playlist-modal',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-playlist-modal.html',
  styleUrl: './add-playlist-modal.scss',
})
export class AddPlaylistModal {
  private readonly fb = inject(FormBuilder);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly addPlaylistForm = this.fb.group({
    title: ['', Validators.required],
    order: ['', Validators.required],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    if (this.addPlaylistForm.invalid) {
      this.addPlaylistForm.markAllAsTouched();
      return;
    }

    this.closeModal();
  }
}
