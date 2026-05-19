import { Component, ViewChild, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { PlaylistsService } from '../../../application/playlists/playlists-service';
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
  private readonly playlistsService = inject(PlaylistsService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public playlistCreated = output<void>();
  public readonly maxOrder = input<number>(1);
  public loading = false;

  public readonly addPlaylistForm = this.fb.group({
    title: ['', Validators.required],
    order: ['', [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => {
      this.addPlaylistForm.controls.order.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxOrder()),
      ]);
      this.addPlaylistForm.controls.order.updateValueAndValidity({ emitEvent: false });
    });
  }

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    if (this.addPlaylistForm.invalid || this.loading) {
      this.addPlaylistForm.markAllAsTouched();
      return;
    }

    const { title, order } = this.addPlaylistForm.getRawValue();

    this.loading = true;
    this.playlistsService
      .createPlaylist({ name: title ?? '', order: Number(order) })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.playlistCreated.emit();
          this.closeModal();
        },
        error: () => {},
      });
  }
}
