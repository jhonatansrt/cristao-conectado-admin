import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeName',
  standalone: true,
})
export class CapitalizeNamePipe implements PipeTransform {
  private readonly lowercaseParticles = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);

  public transform(name?: string | null): string {
    if (!name?.trim()) {
      return '-';
    }

    return name
      .trim()
      .toLocaleLowerCase('pt-BR')
      .split(/\s+/)
      .map((part, index) => {
        if (index > 0 && this.lowercaseParticles.has(part)) {
          return part;
        }

        return part.charAt(0).toLocaleUpperCase('pt-BR') + part.slice(1);
      })
      .join(' ');
  }
}
