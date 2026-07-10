import { Observable } from 'rxjs';
import { CreateEbdTeacherDTO } from './dto/create-ebd-teacher.dto';
import { CreateEbdTeacherResponseDTO } from './dto/create-ebd-teacher-response.dto';
import { GetEbdTeachersDTO } from './dto/get-ebd-teacher.dto';
import { EbdTeacher } from './entities/ebd-teacher.entity';

export abstract class IEbdTeacherRepository {
  abstract postEbdTeacher(props: CreateEbdTeacherDTO): Observable<CreateEbdTeacherResponseDTO>;
  abstract getEbdTeacher(props: GetEbdTeachersDTO): Observable<EbdTeacher[]>;
  abstract deleteEbdTeacher(id: string): Observable<void>;
}
