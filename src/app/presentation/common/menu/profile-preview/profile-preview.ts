import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../../application/auth/auth-store';
import { TypeUser } from '../../../../domain/auth';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';
import { Container } from '../../../../util/container.service';
import { ProfileModal } from './profile-modal/profile-modal';

@Component({
  selector: 'app-profile-preview',
  imports: [MatIconModule, CapitalizeNamePipe],
  templateUrl: './profile-preview.html',
  styleUrl: './profile-preview.scss',
})
export class ProfilePreview {
  private readonly authStore = inject(AuthStore);
  private readonly container = inject(Container);

  protected readonly userLogged = this.authStore.getUserLogged();
  protected readonly userTypeLabel = computed(() =>
    this.userLogged()?.type === TypeUser.MASTER ? 'Master' : 'Administrador',
  );

  protected openProfileModal(): void {
    this.container.vcr?.createComponent(ProfileModal);
  }
}
