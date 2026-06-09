import { TableRow } from '../../application/table/table-store';
import { Member } from '../../domain/members';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

const capitalizeName = new CapitalizeNamePipe();
const formatDate = new FormatDatePipe();

export class MemberTransform {
  public static toRow(member: Member): TableRow {
    return {
      id: member.id,
      name: capitalizeName.transform(member.name),
      email: member.email,
      birthDate: formatDate.transform(member.birth_date),
    };
  }
}
