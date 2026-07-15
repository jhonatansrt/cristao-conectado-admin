import { Observable } from 'rxjs';
import { CreateEbdLessonDTO } from './dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from './dto/create-ebd-lesson-response.dto';
import { CreateEbdLessonPassageDTO } from './dto/create-ebd-lesson-passage.dto';
import { CreateEbdLessonPassageResponseDTO } from './dto/create-ebd-lesson-passage-response.dto';
import { GetEbdLessonsDTO } from './dto/get-ebd-lesson.dto';
import { PutEbdLessonDTO } from './dto/put-ebd-lesson.dto';
import { PutEbdLessonResponseDTO } from './dto/put-ebd-lesson.dto.response';
import { EbdLesson } from './entities/ebd-lesson.entity';

export abstract class IEbdLessonRepository {
  abstract getEbdLessons(props: GetEbdLessonsDTO): Observable<EbdLesson[]>;
  abstract postEbdLesson(props: CreateEbdLessonDTO): Observable<CreateEbdLessonResponseDTO>;
  abstract postEbdLessonPassage(
    props: CreateEbdLessonPassageDTO,
  ): Observable<CreateEbdLessonPassageResponseDTO>;
  abstract putEbdLesson(id: string, props: PutEbdLessonDTO): Observable<PutEbdLessonResponseDTO>;
}
