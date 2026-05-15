import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourRange',
  standalone: true,
})
export class HourRangePipe implements PipeTransform {
  public transform(initialHour: number, finalHour: number): string {
    return `${this.formatHour(initialHour)} - ${this.formatHour(finalHour)}`;
  }

  private formatHour(hour: number): string {
    const normalizedHour = String(hour).padStart(4, '0');
    const hourPart = normalizedHour.slice(0, 2);
    const minutePart = normalizedHour.slice(2, 4);

    return `${hourPart}:${minutePart}`;
  }
}
