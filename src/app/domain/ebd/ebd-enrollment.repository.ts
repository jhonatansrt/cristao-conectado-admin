import { Observable } from 'rxjs';
import { CreateEbdEnrollmentDTO } from './dto/create-ebd-enrollment.dto';
import { CreateEbdEnrollmentResponseDTO } from './dto/create-ebd-enrollment-response.dto';
import { GetEbdEnrollmentsDTO } from './dto/get-ebd-enrollment.dto';
import { EbdEnrollment } from './entities/ebd-enrollment.entity';

export abstract class IEbdEnrollmentRepository {
  abstract getEbdEnrollments(props: GetEbdEnrollmentsDTO): Observable<EbdEnrollment[]>;
  abstract postEbdEnrollment(props: CreateEbdEnrollmentDTO): Observable<CreateEbdEnrollmentResponseDTO>;
}
