import { Observable } from 'rxjs';
import { GetEbdEnrollmentsDTO } from './dto/get-ebd-enrollment.dto';
import { EbdEnrollment } from './entities/ebd-enrollment.entity';

export abstract class IEbdEnrollmentRepository {
  abstract getEbdEnrollments(props: GetEbdEnrollmentsDTO): Observable<EbdEnrollment[]>;
}
