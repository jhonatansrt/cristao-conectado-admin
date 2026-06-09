import { Member } from 'src/app/domain/members';
import { TableRow } from 'src/app/application/table/table-store';
import { CapitalizeNamePipe } from 'src/app/pipes/capitalize-name.pipe';
import { FormatDatePipe } from 'src/app/pipes/format-date.pipe';

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
