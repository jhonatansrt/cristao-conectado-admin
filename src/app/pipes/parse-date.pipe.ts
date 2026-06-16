import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDate',
  standalone: true,
})
export class ParseDatePipe implements PipeTransform {
  public transform(value: string): string {
    const [day, month, year] = value.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
  }
}
