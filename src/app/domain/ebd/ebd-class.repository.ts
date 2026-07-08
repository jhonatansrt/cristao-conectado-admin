import { Observable } from 'rxjs';
import { CreateEbdClassDTO } from './dto/create-ebd-class.dto';
import { CreateEbdClassResponseDTO } from './dto/create-ebd-class-response.dto';
import { GetEbdClassesDTO } from './dto/get-ebd-class.dto';
import { EbdClass } from './entities/ebd-class.entity';
import { PutEbdClassDTO } from './dto/put-ebd-class.dto';
import { PutEbdClassResponseDTO } from './dto/put-ebd-class.dto.response';

export abstract class IEbdClassRepository {
  abstract postEbdClass(props: CreateEbdClassDTO): Observable<CreateEbdClassResponseDTO>;
  abstract getEbdClass(props: GetEbdClassesDTO): Observable<EbdClass[]>;
  abstract putEbdClass(id: string, props: PutEbdClassDTO): Observable<PutEbdClassResponseDTO[]>;
}
