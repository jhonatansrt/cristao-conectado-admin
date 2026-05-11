import { Component, input } from '@angular/core';
import { ButtonClass } from './button.data';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  public readonly disabled = input(false);
  public readonly loading = input(false);
  public readonly btnClass = input<ButtonClass>();
}
