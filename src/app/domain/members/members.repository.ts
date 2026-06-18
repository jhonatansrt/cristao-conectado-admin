import { Observable } from 'rxjs';
import { GetMembersDTO } from './dto/get-members.dto';
import { Member } from './entities/member.entity';

export abstract class IMembersRepository {
  abstract getMembersByChurch(props: GetMembersDTO): Observable<Member[]>;
}
