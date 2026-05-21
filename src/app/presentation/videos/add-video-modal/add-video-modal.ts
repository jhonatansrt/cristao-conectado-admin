import { Component, Input, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { VideosService } from '../../../application/videos/videos-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { CheckboxComponent } from '../../common/checkbox/checkbox';
import { ModalComponent } from '../../common/modal/modal.component';

export type VideoFormData = {
  id: string;
  youtubeId: string;
  name: string;
  order: number;
  showHome: boolean;
};

@Component({
  selector: 'app-add-video-modal',
  imports: [ModalComponent, InputComponent, CheckboxComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-video-modal.html',
  styleUrl: './add-video-modal.scss',
})
export class AddVideoModal implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly videosService = inject(VideosService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  @Input() public videoData?: VideoFormData;
  public videoCreated = output<void>();
  public loading = false;
  public isEditMode = false;

  public readonly addVideoForm = this.fb.group({
    youtubeUrl: ['', Validators.required],
    title: ['', Validators.required],
    order: ['', [Validators.required, Validators.min(1)]],
    featured: [false],
  });

  ngOnInit(): void {
    if (this.videoData) {
      this.isEditMode = true;
      this.addVideoForm.patchValue({
        youtubeUrl: `https://www.youtube.com/watch?v=${this.videoData.youtubeId}`,
        title: this.videoData.name,
        order: String(this.videoData.order),
        featured: this.videoData.showHome,
      });
    }
  }

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

    this.loading = true;

    const request$ = this.isEditMode ? this.updateVideo() : this.createVideo();

    request$.pipe(finalize(() => (this.loading = false))).subscribe(() => {
      this.videoCreated.emit();
      this.closeModal();
    });
  }

  private createVideo() {
    const { youtubeUrl, title, order, featured } = this.addVideoForm.getRawValue();

    return this.videosService.createVideo({
      youtubeId: this.extractYoutubeId(youtubeUrl ?? ''),
      name: title ?? '',
      order: Number(order),
      showHome: Boolean(featured),
    });
  }

  private updateVideo() {
    const { youtubeUrl, title, order, featured } = this.addVideoForm.getRawValue();

    return this.videosService.updateVideo({
      id: this.videoData!.id,
      youtubeId: this.extractYoutubeId(youtubeUrl ?? ''),
      name: title ?? '',
      order: Number(order),
      showHome: Boolean(featured),
    });
  }

  private extractYoutubeId(value: string): string {
    const sanitized = value.trim();
    const regex = /(?:youtu\.be\/|v=|\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = sanitized.match(regex);

    return match?.[1] ?? sanitized;
  }
}
