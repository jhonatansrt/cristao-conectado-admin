import { TableRow } from '../../application/table/table-store';
import { TypeUserUtils } from '../../domain/auth';
import { MaritalStatusUtils } from '../../domain/auth/enums/marital-status.enum';
import { Member } from '../../domain/members';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

const capitalizeName = new CapitalizeNamePipe();
const formatDate = new FormatDatePipe();

export class MemberTransform {
  public static toRow(member: Member): TableRow {
    return {
      id: member.user.id,
      name: capitalizeName.transform(member.user.name),
      email: member.user.email,
      birthDate: formatDate.transform(member.user.birth_date),
      maritalStatus: MaritalStatusUtils.getLabel(member.user.marital_status),
      type: TypeUserUtils.getLabel(member.user.type),
      is_active: member.is_active ? 'Sim' : 'Não',
      is_baptized: member.is_baptized ? 'Sim' : 'Não',
      position: member.memberPosition?.name ?? '-',
    };
  }
}
