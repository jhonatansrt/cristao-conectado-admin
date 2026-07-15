import { Observable } from 'rxjs';
import { CreateEbdLessonDTO } from './dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from './dto/create-ebd-lesson-response.dto';
import { GetEbdLessonsDTO } from './dto/get-ebd-lesson.dto';
import { EbdLesson } from './entities/ebd-lesson.entity';

export abstract class IEbdLessonRepository {
  abstract getEbdLessons(props: GetEbdLessonsDTO): Observable<EbdLesson[]>;
  abstract postEbdLesson(props: CreateEbdLessonDTO): Observable<CreateEbdLessonResponseDTO>;
}
