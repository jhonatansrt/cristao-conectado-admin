import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputComponent } from '../input/input';

export interface AutoCompleteOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-auto-complete',
  imports: [InputComponent],
  templateUrl: './auto-complete.html',
  styleUrl: './auto-complete.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true,
    },
  ],
})
export class AutoCompleteComponent implements ControlValueAccessor, AfterViewInit {
  private static readonly MAX_OPTIONS = 5;

  private readonly elementRef = inject(ElementRef);

  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly errorMessage = input<string>('');
  public readonly options = input<AutoCompleteOption[]>([]);

  public readonly optionSelected = output<AutoCompleteOption>();

  @ViewChild(InputComponent) private input?: InputComponent;

  public filteredOptions: AutoCompleteOption[] = [];
  public showDropdown = false;
  public isDisabled = false;

  private selectedId = '';

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  public ngAfterViewInit(): void {
    if (this.selectedId) {
      this.input?.writeValue(this.displayFor(this.selectedId));
    }
  }

  public onSearch(term: string): void {
    this.selectedId = '';
    this.onChange('');
    this.filterOptions(term);
    this.showDropdown = true;
  }

  public onSelect(option: AutoCompleteOption): void {
    this.selectedId = option.id;
    this.input?.writeValue(option.label);
    this.showDropdown = false;
    this.onChange(option.id);
    this.onTouched();
    this.optionSelected.emit(option);
  }

  @HostListener('click')
  public openDropdown(): void {
    if (this.isDisabled) {
      return;
    }

    this.filterOptions(this.input?.inputValue ?? '');
    this.showDropdown = true;
  }

  @HostListener('document:click', ['$event.target'])
  public onDocumentClick(target: EventTarget | null): void {
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showDropdown = false;
      this.onTouched();
    }
  }

  public writeValue(value: string): void {
    this.selectedId = value ?? '';
    this.input?.writeValue(this.displayFor(this.selectedId));
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

  private displayFor(value: string): string {
    if (!value) {
      return '';
    }

    // Mostra o label da opção correspondente; se não houver, usa o valor cru.
    return this.options().find((item) => item.id === value)?.label ?? value;
  }

  private filterOptions(term: string): void {
    const normalized = term.trim().toLowerCase();
    const matches = normalized
      ? this.options().filter((option) => option.label.toLowerCase().includes(normalized))
      : this.options();

    this.filteredOptions = matches.slice(0, AutoCompleteComponent.MAX_OPTIONS);
  }
}
