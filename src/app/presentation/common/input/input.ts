import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputComponent {
  public readonly label = input<string>('');
  public readonly type = input<string>('text');
  public readonly value = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly errorMessage = input<string>('');

  public readonly valueChange = output<string>();

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
