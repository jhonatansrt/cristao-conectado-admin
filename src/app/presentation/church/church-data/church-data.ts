import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, map } from 'rxjs';
import { inject } from '@angular/core';
import { InputComponent } from '../../common/input/input';
import { SelectComponent } from '../../common/select/select';
import { CardComponent } from '../../common/card/card.component';
import { ChurchStore } from '../../../application/church/church-store';
import { ChurchService } from '../../../application/church/church-service';
import { AuthStore } from '../../../application/auth/auth-store';
import { Container } from '../../../util/container.service';
import { AddressList } from '../../schedule/address-list/address-list';

@Component({
  selector: 'app-church-data',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    InputComponent,
    SelectComponent,
    CardComponent,
  ],
  templateUrl: './church-data.html',
  styleUrl: './church-data.scss',
})
export class ChurchData implements OnInit {
  @Input({ required: true }) form!: FormGroup;

  private readonly churchService = inject(ChurchService);
  private readonly churchStore = inject(ChurchStore);
  private readonly authStore = inject(AuthStore);
  private readonly container = inject(Container);

  protected readonly currentAddress = this.churchStore.getAddres();
  private readonly churchCached = this.churchStore.getChurchCached();

  protected get churchAvatar(): string | null {
    return this.churchCached()?.church_avatar || null;
  }

  protected get churchBanner(): string | null {
    return this.churchCached()?.church_banner || null;
  }

  protected uploadingPhoto = false;
  protected uploadingBanner = false;
  churchTypes: { value: string; label: string }[] = [];

  private pendingAvatarFile: File | null = null;
  private pendingBannerFile: File | null = null;

  private get hasChurch(): boolean {
    return !!this.authStore.getUserLogged()()?.church_id;
  }

  ngOnInit(): void {
    this.churchService
      .listChurchType()
      .pipe(map((types) => types.map((t) => ({ value: t.id, label: t.name }))))
      .subscribe((types) => {
        this.churchTypes = types;
        if (!this.form.controls['type_id'].value) {
          this.form.patchValue({ type_id: types[0]?.value });
        }
      });
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

  protected openAddress(): void {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();
    return addr ? `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}` : '';
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
