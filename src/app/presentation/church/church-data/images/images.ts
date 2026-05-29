import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { ChurchStore } from '../../../../application/church/church-store';
import { ChurchService } from '../../../../application/church/church-service';
import { AuthStore } from '../../../../application/auth/auth-store';

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

  protected get churchAvatar(): string | null {
    return this.churchCached()?.church_avatar || null;
  }

  protected get churchBanner(): string | null {
    return this.churchCached()?.church_banner || null;
  }

  protected uploadingPhoto = false;
  protected uploadingBanner = false;

  private pendingAvatarFile: File | null = null;
  private pendingBannerFile: File | null = null;

  private get hasChurch(): boolean {
    return !!this.authStore.getUserLogged()()?.church_id;
  }

  uploadPendingFiles(): void {
    if (this.pendingAvatarFile) {
      this.uploadAvatar(this.pendingAvatarFile);
      this.pendingAvatarFile = null;
    }
    if (this.pendingBannerFile) {
      this.uploadBanner(this.pendingBannerFile);
      this.pendingBannerFile = null;
    }
  }

  protected openFilePickerAvatar(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!this.hasChurch) {
        this.churchStore.patchChurchImage('church_avatar', URL.createObjectURL(file));
        this.pendingAvatarFile = file;
        return;
      }

      this.uploadAvatar(file);
    };
    input.click();
  }

  private uploadAvatar(file: File): void {
    this.uploadingPhoto = true;
    this.churchService
      .updateChurchIcon({ file })
      .pipe(finalize(() => (this.uploadingPhoto = false)))
      .subscribe();
  }

  protected openFilePickerBanner(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!this.hasChurch) {
        this.churchStore.patchChurchImage('church_banner', URL.createObjectURL(file));
        this.pendingBannerFile = file;
        return;
      }

      this.uploadBanner(file);
    };
    input.click();
  }

  private uploadBanner(file: File): void {
    this.uploadingBanner = true;
    this.churchService
      .updateChurchBanner({ file })
      .pipe(finalize(() => (this.uploadingBanner = false)))
      .subscribe();
  }
}
