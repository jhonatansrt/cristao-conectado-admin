import { Component, input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxComponent {
  public readonly label = input<string>('');
  public readonly isChecked = input<boolean>(false);
}
