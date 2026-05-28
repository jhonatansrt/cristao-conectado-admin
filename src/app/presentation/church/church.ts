import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
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
import { ToastService } from '../common/toast/toast.service';

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
  public readonly churchStore = inject(ChurchStore);
  private readonly churchService = inject(ChurchService);
  private readonly authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public currentAddress = this.churchStore.getAddres();
  public isLoading = false;
  public actionButton: string = this.authStore.getUserLogged()()?.church_id
    ? 'Editar Igreja'
    : 'Criar Igreja';

  public churchAvatar: string | null = null;
  public churchBanner: string | null = null;

  protected chuchType: any = [];
  protected uploadingPhoto = false;

  public readonly form = this.fb.group({
    phone: ['', Validators.required],
    name: ['', Validators.required],
    address_id: ['', Validators.required],
    type_id: ['', Validators.required],
    facebook: [''],
    instagram: [''],
    youtube: [''],
  });

  constructor() {}

  ngOnInit(): void {
    this.lisChurchType();
    this.loadChurch();
  }

  private loadChurch() {
    this.churchService.findById().subscribe({
      next: (church) => {
        this.form.patchValue({
          phone: church.phone,
          name: church.name,
          address_id: church.address.id,
          type_id: church.type.id,
          facebook: church.facebook,
          instagram: church.instagram,
          youtube: church.youtube,
        });
        this.churchAvatar = church.church_avatar || null;
        this.churchBanner = church.church_banner || null;
      },
    });
  }

  private lisChurchType() {
    this.churchService
      .listChurchType()
      .pipe(
        map((types) =>
          types.map((type) => ({
            value: type.id,
            label: type.name,
          })),
        ),
      )
      .subscribe({
        next: (listChurch) => {
          this.chuchType = listChurch;
          this.form.patchValue({
            type_id: listChurch[0].value,
          });
        },
        error: () => {},
      });
  }

  public openAddress() {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  protected onChangeAddress(): void {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  public sendChurch(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { phone, name, address_id, type_id, facebook, instagram, youtube } =
      this.form.getRawValue();

    this.isLoading = true;

    if (this.authStore.getUserLogged()()?.church_id) {
      this.churchService
        .updateChurch({
          phone: phone ?? '',
          name: name ?? '',
          address_id: address_id ?? '',
          type_id: type_id ?? '',
          instagram: instagram,
          facebook: facebook,
          youtube: youtube,
        })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: async () => {},
          error: () => {},
        });
    } else {
      this.churchService
        .createChurch({
          phone: phone ?? '',
          name: name ?? '',
          address_id: address_id ?? '',
          type_id: type_id ?? '',
          instagram: instagram,
          facebook: facebook,
          youtube: youtube,
        })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: async () => {},
          error: () => {},
        });
    }
  }

  protected openFilePickerAvatar(): void {
    if (this.actionButton === 'Criar Igreja') {
      this.toastService.openToast({ success: false, message: 'Crie uma igreja primeiro' });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
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
    };
    input.click();
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();

    if (!addr) {
      return '';
    }

    return `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}`;
  }

  // protected openFilePickerBanner(): void {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = 'image/*';
  //   input.onchange = (event: Event) => {
  //     const file = (event.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       this.uploadingPhoto = true;
  //       this.churchService
  //         .updateChurchBanner({ file })
  //         .pipe(finalize(() => (this.uploadingPhoto = false)))
  //         .subscribe({
  //           next: (resp) => {
  //             this.churchAvatar = resp.image;
  //           }}
  //         );
  //     }
  //   };
  //   input.click();
  // }
}
