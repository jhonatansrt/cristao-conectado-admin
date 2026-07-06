import { Observable } from 'rxjs';
import { CreateEbdClassDTO } from './dto/create-ebd-class.dto';
import { CreateEbdClassResponseDTO } from './dto/create-ebd-class-response.dto';

export abstract class IEbdClassRepository {
  abstract postEbdClass(props: CreateEbdClassDTO): Observable<CreateEbdClassResponseDTO>;
}
