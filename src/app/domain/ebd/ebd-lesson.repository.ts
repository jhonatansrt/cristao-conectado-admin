import { Observable } from 'rxjs';
import { CreateEbdLessonDTO } from './dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from './dto/create-ebd-lesson-response.dto';

export abstract class IEbdLessonRepository {
  abstract postEbdLesson(props: CreateEbdLessonDTO): Observable<CreateEbdLessonResponseDTO>;
}
