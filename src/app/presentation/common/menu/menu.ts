import { Component } from '@angular/core';
import { ProfilePreview } from './profile-preview/profile-preview';

@Component({
  selector: 'app-menu',
  imports: [ProfilePreview],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {

}
