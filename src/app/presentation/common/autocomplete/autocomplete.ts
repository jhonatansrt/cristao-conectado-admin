import {
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputComponent } from '../input/input';

export interface AutocompleteOption {
  id: string;
  label: string;
  data?: unknown;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [InputComponent, NgTemplateOutlet],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly options = input<AutocompleteOption[]>([]);
  public readonly clearOnSelect = input<boolean>(false);

  public readonly optionSelected = output<AutocompleteOption>();

  @ContentChild(TemplateRef)
  protected optionTemplate?: TemplateRef<{ $implicit: AutocompleteOption }>;
  @ViewChild(InputComponent) private readonly searchInput?: InputComponent;

  private readonly host = inject(ElementRef);

  protected filteredOptions: AutocompleteOption[] = [];
  protected displayValue = '';

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected onSearch(value: string): void {
    this.displayValue = value;
    this.onChange(value);

    const term = value.trim().toLowerCase();
    if (!term) {
      this.filteredOptions = [];
      return;
    }

    this.filteredOptions = this.options().filter((option) =>
      option.label.toLowerCase().includes(term),
    );
  }

  protected onSelect(option: AutocompleteOption): void {
    this.filteredOptions = [];

    if (this.clearOnSelect()) {
      this.searchInput?.reset();
      this.displayValue = '';
    } else {
      this.displayValue = option.label;
      this.searchInput?.writeValue(option.label);
      this.onChange(option.label);
    }

    this.onTouched();
    this.optionSelected.emit(option);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.filteredOptions = [];
    }
  }

  public writeValue(value: string): void {
    this.displayValue = value ?? '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
