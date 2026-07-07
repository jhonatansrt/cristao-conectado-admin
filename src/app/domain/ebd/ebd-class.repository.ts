import { Observable } from 'rxjs';
import { CreateEbdClassDTO } from './dto/create-ebd-class.dto';
import { CreateEbdClassResponseDTO } from './dto/create-ebd-class-response.dto';
import { GetEbdClassParamsDTO } from './dto/get-ebd-class.dto';
import { EbdClass } from './entities/ebd-class.entity';

export abstract class IEbdClassRepository {
  abstract postEbdClass(props: CreateEbdClassDTO): Observable<CreateEbdClassResponseDTO>;
  abstract getEbdClass(props: GetEbdClassParamsDTO): Observable<EbdClass[]>;
}
