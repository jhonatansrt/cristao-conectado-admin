import { Component, Input, OnInit, ViewChild, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { PlaylistsService } from '../../../application/playlists/playlists-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

export type PlaylistFormData = {
  id: string;
  name: string;
  order: number;
};

@Component({
  selector: 'app-add-playlist-modal',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-playlist-modal.html',
  styleUrl: './add-playlist-modal.scss',
})
export class AddPlaylistModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly playlistsService = inject(PlaylistsService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  @Input() public playlistData?: PlaylistFormData;
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

  ngOnInit(): void {
    this.patchValue();
  }

  private patchValue(): void {
    if (this.playlistData) {
      this.addPlaylistForm.patchValue({
        title: this.playlistData.name,
        order: String(this.playlistData.order),
      });
    }
  }

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    if (this.addPlaylistForm.invalid || this.loading) {
      this.addPlaylistForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request$ = this.playlistData ? this.updatePlaylist() : this.createPlaylist();

    request$.pipe(finalize(() => (this.loading = false))).subscribe(() => {
      this.playlistCreated.emit();
      this.closeModal();
    });
  }

  private createPlaylist() {
    const { title, order } = this.addPlaylistForm.getRawValue();

    return this.playlistsService.createPlaylist({ name: title ?? '', order: Number(order) });
  }

  private updatePlaylist() {
    const { title, order } = this.addPlaylistForm.getRawValue();

    return this.playlistsService.updatePlaylist({
      id: this.playlistData!.id,
      name: title ?? '',
      order: Number(order),
    });
  }
}
