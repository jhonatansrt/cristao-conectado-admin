import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '../common/modal/modal.component';
import { CardComponent, CardIconAction } from '../common/card/card.component';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { AuthStore } from '../../application/auth/auth-store';

interface ProfileMenuItem {
  title: string;
  icons: CardIconAction[];
  click: () => void;
}

@Component({
  selector: 'app-profile-modal',
  imports: [ModalComponent, MatIconModule, CapitalizeNamePipe, CardComponent],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.scss',
})
export class ProfileModal {
  private readonly authStore = inject(AuthStore);

  protected readonly userLogged = this.authStore.getUserLogged();

  protected readonly menuItems: ProfileMenuItem[] = [
    {
      title: 'Dados pessoais',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => {},
    },
    {
      title: 'Alterar senha',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => {},
    },
    {
      title: 'Configurações',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => {},
    },
  ];
}
