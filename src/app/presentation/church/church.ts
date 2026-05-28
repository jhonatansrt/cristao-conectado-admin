import { Component, effect, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../common/input/input';
import { ChurchStore } from '../../application/church/church-store';
import { ChurchService } from '../../application/church/church-service';
import { SelectComponent } from '../common/select/select';
import { finalize, map } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Container } from '../../util/container.service';
import { AddressList } from '../schedule/address-list/address-list';
import { CardComponent } from '../common/card/card.component';
import { ButtonComponent } from '../common/button/button.component';
import { AuthStore } from '../../application/auth/auth-store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { phoneMask } from '../../masks/phone.mask';
import { Router } from '@angular/router';
import { namedRoutes } from '../../named-routes';

@Component({
  selector: 'app-church',
  imports: [
    MatIconModule,
    InputComponent,
    SelectComponent,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class Church implements OnInit {
  private readonly container = inject(Container);
  private readonly fb = inject(FormBuilder);
  private readonly churchService = inject(ChurchService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  protected readonly churchStore = inject(ChurchStore);

  protected readonly currentAddress = this.churchStore.getAddres();
  protected churchAvatar: string | null = null;

  constructor() {
    effect(() => {
      const addr = this.currentAddress();
      this.form.patchValue({ address_id: addr?.id ?? '' });
    });
  }
  protected churchBanner: string | null = null;
  protected uploadingPhoto = false;
  protected uploadingBanner = false;
  protected isLoading = false;
  protected churchTypes: { value: string; label: string }[] = [];

  private pendingAvatarFile: File | null = null;
  private pendingBannerFile: File | null = null;
  private initialFormValue: ReturnType<typeof this.form.getRawValue> | null = null;

  protected get hasChurch(): boolean {
    return !!this.authStore.getUserLogged()()?.church_id;
  }

  protected get isButtonDisabled(): boolean {
    if (!this.hasChurch) {
      return this.form.invalid;
    }

    if (!this.initialFormValue) {
      return true;
    }

    return (
      this.form.invalid ||
      JSON.stringify(this.form.getRawValue()) === JSON.stringify(this.initialFormValue)
    );
  }

  public readonly form = this.fb.group({
    phone: ['', Validators.required],
    name: ['', Validators.required],
    address_id: ['', Validators.required],
    type_id: ['', Validators.required],
    facebook: [''],
    instagram: [''],
    youtube: [''],
  });

  ngOnInit(): void {
    this.loadChurchTypes();
    this.loadChurch();
  }

  private loadChurch(): void {
    this.churchService.findById().subscribe((church) => {
      this.form.patchValue({
        phone: phoneMask(church.phone ?? ''),
        name: church.name,
        address_id: church.address.id,
        type_id: church.type.id,
        facebook: church.facebook,
        instagram: church.instagram,
        youtube: church.youtube,
      });
      this.churchAvatar = church.church_avatar || null;
      this.churchBanner = church.church_banner || null;
      this.initialFormValue = this.form.getRawValue();
    });
  }

  private loadChurchTypes(): void {
    this.churchService
      .listChurchType()
      .pipe(map((types) => types.map((t) => ({ value: t.id, label: t.name }))))
      .subscribe((types) => {
        this.churchTypes = types;
        this.form.patchValue({ type_id: types[0]?.value });
      });
  }

  protected openAddress(): void {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();
    return addr ? `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}` : '';
  }

  public sendChurch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { phone, name, address_id, type_id, facebook, instagram, youtube } =
      this.form.getRawValue();

    this.isLoading = true;
    const isCreating = !this.hasChurch;

    const payload = {
      phone: (phone ?? '').replace(/\D/g, ''),
      name: name ?? '',
      type_id: type_id ?? '',
      facebook: facebook || null,
      instagram: instagram || null,
      youtube: youtube || null,
      ...(isCreating ? {} : { address_id: address_id ?? '' }),
    };

    const action$ = isCreating
      ? this.churchService.createChurch(payload)
      : this.churchService.updateChurch(payload);

    action$.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        if (!isCreating) {
          this.initialFormValue = this.form.getRawValue();
        }
        if (isCreating && this.pendingAvatarFile) {
          this.uploadAvatar(this.pendingAvatarFile);
          this.pendingAvatarFile = null;
        }
        if (isCreating && this.pendingBannerFile) {
          this.uploadBanner(this.pendingBannerFile);
          this.pendingBannerFile = null;
        }
        if (isCreating) {
          this.router.navigate([namedRoutes.schedule]);
        }
      },
    });
  }

  protected openFilePickerAvatar(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!this.hasChurch) {
        this.churchAvatar = URL.createObjectURL(file);
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
      .subscribe({
        next: (resp) => {
          this.churchAvatar = resp.image;
        },
      });
  }

  protected openFilePickerBanner(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (!this.hasChurch) {
        this.churchBanner = URL.createObjectURL(file);
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
      .subscribe({
        next: (resp) => {
          this.churchBanner = resp.image;
        },
      });
  }
}
