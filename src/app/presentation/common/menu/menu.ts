import { Component } from '@angular/core';
import { ProfilePreview } from './profile-preview/profile-preview';
import { MenuItems } from './menu-items/menu-items';

@Component({
  selector: 'app-menu',
  imports: [ProfilePreview, MenuItems],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

}
