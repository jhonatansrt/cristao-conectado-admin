import { Component, input, model } from '@angular/core';

export type WeekDay = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-week-day-picker',
  standalone: true,
  templateUrl: './week-day-picker.html',
  styleUrl: './week-day-picker.scss',
})
export class WeekDayPicker {
  public readonly legend = input<string>('Dias da semana');
  public readonly days = input<WeekDay[]>([]);
  public readonly selected = model<Set<string>>(new Set());

  protected isDaySelected(value: string): boolean {
    return this.selected().has(value);
  }

  protected toggle(value: string): void {
    const next = new Set(this.selected());
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    this.selected.set(next);
  }
}
