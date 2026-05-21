import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModalComponent } from '../common/modal/modal.component';
import { CardComponent, CardIconAction } from '../common/card/card.component';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { AuthStore } from '../../application/auth/auth-store';
import { Container } from '../../util/container.service';
import { PersonalDatas } from './personal-datas/personal-datas';

interface ProfileMenuItem {
  title: string;
  icons: CardIconAction[];
  click: () => void;
}

@Component({
  selector: 'app-profile',
  imports: [ModalComponent, MatIconModule, CapitalizeNamePipe, CardComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly authStore = inject(AuthStore);
  private readonly container = inject(Container);

  protected readonly userLogged = this.authStore.getUserLogged();

  protected readonly menuItems: ProfileMenuItem[] = [
    {
      title: 'Dados pessoais',
      icons: [{ name: 'navigate_next', action: () => {} }],
      click: () => this.container.vcr?.createComponent(PersonalDatas),
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
