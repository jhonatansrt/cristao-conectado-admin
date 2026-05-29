import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs';
import { ChurchStore } from '../../application/church/church-store';
import { ChurchService } from '../../application/church/church-service';
import { Church } from '../../domain/church';
import { AuthStore } from '../../application/auth/auth-store';
import { ButtonComponent } from '../common/button/button.component';
import { SocialMedia } from './social-media/social-media';
import { ChurchData } from './church-data/church-data';
import { phoneMask } from '../../masks/phone.mask';
import { Router } from '@angular/router';
import { namedRoutes } from '../../named-routes';

@Component({
  selector: 'app-church',
  imports: [ReactiveFormsModule, ButtonComponent, SocialMedia, ChurchData],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class ChurchPage implements OnInit {
  @ViewChild(ChurchData) private readonly churchData!: ChurchData;

  private readonly fb = inject(FormBuilder);
  private readonly churchService = inject(ChurchService);
  private readonly authStore = inject(AuthStore);
  private readonly churchStore = inject(ChurchStore);
  private readonly router = inject(Router);

  private readonly currentAddress = this.churchStore.getAddres();
  private initialFormValue: ReturnType<typeof this.form.getRawValue> | null = null;

  protected isLoading = false;

  constructor() {
    effect(() => {
      const addr = this.currentAddress();
      this.form.patchValue({ address_id: addr?.id ?? '' });
    });
  }

  protected get hasChurch(): boolean {
    return !!this.authStore.getUserLogged()()?.church_id;
  }

  protected get isButtonDisabled(): boolean {
    if (!this.hasChurch) return this.form.invalid;
    if (!this.initialFormValue) return true;

    const { address_id: _cur, ...current } = this.form.getRawValue();
    const { address_id: _ini, ...initial } = this.initialFormValue;

    return this.form.invalid || JSON.stringify(current) === JSON.stringify(initial);
  }

  readonly form = this.fb.group({
    phone: ['', Validators.required],
    name: ['', Validators.required],
    address_id: ['', Validators.required],
    type_id: ['', Validators.required],
    facebook: [''],
    instagram: [''],
    youtube: [''],
  });

  ngOnInit(): void {
    this.loadChurch();
  }

  private loadChurch(): void {
    const cached = this.churchStore.getChurchCached()();
    if (cached) this.patchFormFromChurch(cached);

    this.churchService.findById().subscribe((church) => {
      this.patchFormFromChurch(church);
    });
  }

  private patchFormFromChurch(church: Church): void {
    this.form.patchValue({
      phone: phoneMask(church.phone ?? ''),
      name: church.name,
      address_id: church.address?.id ?? '',
      type_id: church.type?.id ?? '',
      facebook: church.facebook,
      instagram: church.instagram,
      youtube: church.youtube,
    });

    this.churchStore.setAddress(church.address ?? null);
    this.initialFormValue = this.form.getRawValue();
  }

  protected sendChurch(): void {
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
          const selectedType = this.churchData.churchTypes.find((t) => t.value === type_id);
          this.churchStore.patchChurchUpdate({
            name: name ?? '',
            phone: (phone ?? '').replace(/\D/g, ''),
            facebook: facebook || null,
            instagram: instagram || null,
            youtube: youtube || null,
            ...(selectedType ? { type: { id: selectedType.value, name: selectedType.label } } : {}),
          });
        }
        if (isCreating) {
          this.churchData.uploadPendingFiles();
          this.router.navigate([namedRoutes.schedule]);
        }
      },
    });
  }
}
