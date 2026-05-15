import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxComponent {
  public readonly label = input<string>('');
  public readonly isChecked = input<boolean>(false);
  public readonly isCheckedChange = output<boolean>();

  public onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.isCheckedChange.emit(checked);
  }
}
