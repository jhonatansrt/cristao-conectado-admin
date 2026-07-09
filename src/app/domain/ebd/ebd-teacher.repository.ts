import { Observable } from 'rxjs';
import { CreateEbdTeacherDTO } from './dto/create-ebd-teacher.dto';
import { CreateEbdTeacherResponseDTO } from './dto/create-ebd-teacher-response.dto';

export abstract class IEbdTeacherRepository {
  abstract postEbdTeacher(props: CreateEbdTeacherDTO): Observable<CreateEbdTeacherResponseDTO>;
}
