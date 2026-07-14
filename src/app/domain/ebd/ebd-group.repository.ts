import { Observable } from 'rxjs';
import { CreateEbdGroupDTO } from './dto/create-ebd-group.dto';
import { CreateEbdGroupResponseDTO } from './dto/create-ebd-group-response.dto';
import { GetEbdGroupsDTO } from './dto/get-ebd-group.dto';
import { EbdGroupListItem } from './entities/ebd-group.entity';

export abstract class IEbdGroupRepository {
  abstract postEbdGroup(props: CreateEbdGroupDTO): Observable<CreateEbdGroupResponseDTO>;
  abstract getEbdGroup(props: GetEbdGroupsDTO): Observable<EbdGroupListItem[]>;
}
