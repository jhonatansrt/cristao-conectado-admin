import { Observable } from 'rxjs';
import { GetMembersDTO } from './dto/get-members.dto';
import { Member } from './entities/member.entity';
import { UpdateMemberDTO } from './dto/update-member.dto';

export abstract class IMembersRepository {
  abstract getMembersByChurch(props: GetMembersDTO): Observable<Member[]>;
  abstract updateChurchMember(props: UpdateMemberDTO): Observable<Member>;
}
