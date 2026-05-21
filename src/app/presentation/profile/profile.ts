import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalComponent } from '../common/modal/modal.component';
import { CardComponent, CardIconAction } from '../common/card/card.component';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { AuthStore } from '../../application/auth/auth-store';
import { AuthService } from '../../application/auth/auth-service';
import { Container } from '../../util/container.service';
import { PersonalDatas } from './personal-datas/personal-datas';
import { UpdatePassword } from './update-password/update-password';
import { finalize } from 'rxjs';

interface ProfileMenuItem {
  title: string;
  icons: CardIconAction[];
  click: () => void;
}

@Component({
  selector: 'app-profile',
  imports: [ModalComponent, MatIconModule, MatProgressSpinnerModule, CapitalizeNamePipe, CardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly container = inject(Container);

  protected readonly userLogged = this.authStore.getUserLogged();
  protected readonly uploadingPhoto = signal(false);

  protected openFilePicker(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.uploadingPhoto.set(true);
        this.authService
          .updateAvatar({ file })
          .pipe(finalize(() => this.uploadingPhoto.set(false)))
          .subscribe();
      }
    };
    input.click();
  }

  protected readonly menuItems: ProfileMenuItem[] = [
    {
      title: 'Dados pessoais',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => this.container.vcr?.createComponent(PersonalDatas),
    },
    {
      title: 'Alterar senha',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => this.container.vcr?.createComponent(UpdatePassword),
    },
  ];
}
