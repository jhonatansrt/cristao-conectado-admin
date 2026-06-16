import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseTime',
  standalone: true,
})
export class ParseTimePipe implements PipeTransform {
  public transform(value: string): number {
    return parseInt(value.replace(':', ''), 10) || 0;
  }
}
