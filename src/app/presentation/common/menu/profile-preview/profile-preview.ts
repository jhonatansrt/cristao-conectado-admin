import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../../application/auth/auth-store';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';

@Component({
  selector: 'app-profile-preview',
  imports: [MatIconModule, CapitalizeNamePipe],
  templateUrl: './profile-preview.html',
  styleUrl: './profile-preview.scss',
})
export class ProfilePreview {
  private readonly authStore = inject(AuthStore);
  public readonly userLogged = this.authStore.getUserLogged();
}
