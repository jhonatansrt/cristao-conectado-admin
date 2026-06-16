import { Observable } from 'rxjs';
import { GetMembersDTO } from './dto/get-members.dto';
import { Member } from './entities/member.entity';
import { GetMembersPositionResponseDTO } from './dto/get-members-position-response.dto';

export abstract class IMembersRepository {
  abstract getMembersByChurch(props: GetMembersDTO): Observable<Member[]>;
  abstract getMemberPositions(props: GetMembersDTO): Observable<GetMembersPositionResponseDTO[]>;
}
