import { Component, ElementRef, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../../../../application/auth/auth-store';
import { CapitalizeNamePipe } from '../../../../../../pipes/capitalize-name.pipe';
import { CardComponent, CardIconAction } from '../../../../card/card.component';

interface ProfileMenuItem {
  title: string;
  icons: CardIconAction[];
  click: () => void;
}

@Component({
  selector: 'app-profile-modal',
  imports: [MatIconModule, CapitalizeNamePipe, CardComponent],
  templateUrl: './profile-modal.html',
  styleUrl: './profile-modal.scss',
})
export class ProfileModal {
  private readonly authStore = inject(AuthStore);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

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

  protected close(): void {
    const el = this.elementRef.nativeElement;
    el.querySelector('.backdrop')?.classList.add('backdrop--closing');
    el.querySelector('.panel')?.classList.add('panel--closing');
    setTimeout(() => el.remove(), 200);
  }
}
