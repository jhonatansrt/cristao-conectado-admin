import { Component, input, output } from '@angular/core';
import { DateOfBirthMaskDirective } from '../../../masks/date-of-birth-mask.directive';

@Component({
  selector: 'app-input',
  imports: [DateOfBirthMaskDirective],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  public readonly label = input<string>('');
  public readonly type = input<string>('text');
  public readonly value = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly dateOfBirth = input<boolean>(false);

  public readonly valueChange = output<string>();

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
