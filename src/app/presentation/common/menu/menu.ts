import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { ProfilePreview } from './profile-preview/profile-preview';
import { MenuItems } from './menu-items/menu-items';
import { MenuStore } from '../../../application/menu/menu-store';

@Component({
  selector: 'app-menu',
  imports: [ProfilePreview, MenuItems],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private readonly menuStore = inject(MenuStore);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  protected readonly isOpen = this.menuStore.getIsOpen();

  protected closeMenu(): void {
    this.menuStore.close();
  }

  @HostListener('document:click', ['$event'])
  protected onClickOutside(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.menuStore.close();
    }
  }
}
