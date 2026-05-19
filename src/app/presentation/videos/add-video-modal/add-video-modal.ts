import { Component, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { VideosService } from '../../../application/videos/videos-service';
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
  private readonly videosService = inject(VideosService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public videoCreated = output<void>();
  public loading = false;

  public readonly addVideoForm = this.fb.group({
    youtubeUrl: ['', Validators.required],
    title: ['', Validators.required],
    order: ['', [Validators.required, Validators.min(1)]],
    featured: [false],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onFeaturedChange(value: boolean): void {
    this.addVideoForm.patchValue({ featured: value });
  }

  public onConfirm(): void {
    if (this.addVideoForm.invalid || this.loading) {
      this.addVideoForm.markAllAsTouched();
      return;
    }

    const { youtubeUrl, title, order, featured } = this.addVideoForm.getRawValue();
    const youtubeId = this.extractYoutubeId(youtubeUrl ?? '');

    this.loading = true;
    this.videosService
      .createVideo({
        youtubeId,
        name: title ?? '',
        order: Number(order),
        showHome: Boolean(featured),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.videoCreated.emit();
          this.closeModal();
        },
        error: () => {},
      });
  }

  private extractYoutubeId(value: string): string {
    const sanitized = value.trim();
    const regex = /(?:youtu\.be\/|v=|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = sanitized.match(regex);

    return match?.[1] ?? sanitized;
  }
}
