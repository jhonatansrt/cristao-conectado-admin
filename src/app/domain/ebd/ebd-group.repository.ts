import { Observable } from 'rxjs';
import { CreateEbdGroupDTO } from './dto/create-ebd-group.dto';
import { CreateEbdGroupResponseDTO } from './dto/create-ebd-group-response.dto';

export abstract class IEbdGroupRepository {
  abstract postEbdGroup(props: CreateEbdGroupDTO): Observable<CreateEbdGroupResponseDTO>;
}
