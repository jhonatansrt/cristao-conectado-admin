import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-select',
  imports: [MatIconModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly options = input<SelectOption[]>([]);
  public readonly errorMessage = input<string>('');
  public readonly optionSelected = input<string | number | null>(null);

  public readonly valueChange = output<string | number>();

  public selectValue: string | number = '';
  public isDisabled = false;

  public get effectiveValue(): string | number {
    return this.optionSelected() ?? this.selectValue;
  }

  private onChangeFn: (value: string | number) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  public onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectValue = target.value;
    this.valueChange.emit(this.selectValue);
    this.onChangeFn(this.selectValue);
  }

  public onBlur(): void {
    this.onTouchedFn();
  }

  public writeValue(value: string | number): void {
    this.selectValue = value ?? '';
  }

  public registerOnChange(fn: (value: string | number) => void): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
