import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ChurchStore } from '../../../application/church/church-store';
import { ChurchService } from '../../../application/church/church-service';
import { AuthStore } from '../../../application/auth/auth-store';

@Component({
  selector: 'app-images',
  imports: [MatIconModule, MatProgressSpinnerModule],
  templateUrl: './images.html',
  styleUrl: './images.scss',
})
export class ImagesComponent {
  private readonly churchService = inject(ChurchService);
  private readonly churchStore = inject(ChurchStore);
  private readonly authStore = inject(AuthStore);

  private readonly churchCached = this.churchStore.getChurchCached();

  protected readonly pendingAvatarPreview = signal<string | null>(null);
  protected readonly pendingBannerPreview = signal<string | null>(null);

  protected readonly churchAvatar = computed(
    () => this.churchCached()?.church_avatar || this.pendingAvatarPreview() || null,
  );

  protected readonly churchBanner = computed(
    () => this.churchCached()?.church_banner || this.pendingBannerPreview() || null,
  );

  protected uploadingPhoto = false;
  protected uploadingBanner = false;

  private readonly hasChurch = computed(() => !!this.authStore.getUserLogged()()?.church_id);

  protected openFilePicker(type: 'avatar' | 'banner'): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      this.fileOnchange(event, type);
    };
    input.click();
  }

  private fileOnchange(event: Event, type: 'avatar' | 'banner') {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    if (!this.hasChurch()) {
      if (type === 'avatar') {
        this.pendingAvatarPreview.set(URL.createObjectURL(file));
        this.churchStore.setPendingAvatarFile(file);
        return;
      }

      this.pendingBannerPreview.set(URL.createObjectURL(file));
      this.churchStore.setPendingBannerFile(file);

      return;
    }

    if (type === 'avatar') {
      this.uploadAvatar(file);
      return;
    }

    this.uploadBanner(file);
  }

  private uploadAvatar(file: File): void {
    this.uploadingPhoto = true;
    this.churchService
      .updateChurchIcon({ file })
      .pipe(finalize(() => (this.uploadingPhoto = false)))
      .subscribe();
  }

  private uploadBanner(file: File): void {
    this.uploadingBanner = true;
    this.churchService
      .updateChurchBanner({ file })
      .pipe(finalize(() => (this.uploadingBanner = false)))
      .subscribe();
  }
}
