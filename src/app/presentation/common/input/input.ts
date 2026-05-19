import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateOfBirthMaskDirective } from '../../../masks/date-of-birth-mask.directive';
import { TimeMaskDirective } from '../../../masks/time-mask.directive';

@Component({
  selector: 'app-input',
  imports: [DateOfBirthMaskDirective, TimeMaskDirective],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  public readonly label = input<string>('');
  public readonly type = input<string>('text');
  public readonly value = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly dateOfBirth = input<boolean>(false);
  public readonly timeMask = input<boolean>(false);

  public readonly valueChange = output<string>();

  public inputValue = '';
  public isDisabled = false;

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
    this.valueChange.emit(this.inputValue);
    this.onChange(this.inputValue);
  }

  public onBlur(): void {
    this.onTouched();
  }

  public writeValue(value: string): void {
    this.inputValue = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  public reset(): void {
    this.inputValue = '';
    this.onChange('');
  }
}
