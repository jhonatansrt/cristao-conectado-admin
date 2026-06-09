import { inject, Pipe, PipeTransform } from '@angular/core';
import { Member } from '../domain/members';
import { TableRow } from '../application/table/table-store';
import { CapitalizeNamePipe } from './capitalize-name.pipe';
import { FormatDatePipe } from './format-date.pipe';

@Pipe({
  name: 'memberRow',
  standalone: true,
})
export class MemberRowPipe implements PipeTransform {
  private readonly capitalizeNamePipe = inject(CapitalizeNamePipe);
  private readonly formatDatePipe = inject(FormatDatePipe);

  public transform(member: Member): TableRow {
    return {
      id: member.id,
      name: this.capitalizeNamePipe.transform(member.name),
      email: member.email,
      birthDate: this.formatDatePipe.transform(member.birth_date),
    };
  }
}
