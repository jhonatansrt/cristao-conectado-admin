import { Component, output, signal } from '@angular/core';

const WEEK_DAYS = [
  { label: 'Dom', value: 'dom' },
  { label: 'Seg', value: 'seg' },
  { label: 'Ter', value: 'ter' },
  { label: 'Qua', value: 'qua' },
  { label: 'Qui', value: 'qui' },
  { label: 'Sex', value: 'sex' },
  { label: 'Sáb', value: 'sab' },
];

@Component({
  selector: 'app-week-day-picker',
  standalone: true,
  templateUrl: './week-day-picker.html',
  styleUrl: './week-day-picker.scss',
})
export class WeekDayPicker {
  public readonly selectionChange = output<string[]>();

  protected readonly days = WEEK_DAYS;
  protected readonly selected = signal<string[]>([]);

  protected isDaySelected(value: string): boolean {
    return this.selected().includes(value);
  }

  protected toggle(value: string): void {
    const current = this.selected();
    const next = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    this.selected.set(next);
    this.selectionChange.emit(next);
  }
}
