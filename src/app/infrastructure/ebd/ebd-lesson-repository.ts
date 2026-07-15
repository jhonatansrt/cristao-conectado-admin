import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdLessonRepository } from '../../domain/ebd/ebd-lesson.repository';
import { CreateEbdLessonDTO } from '../../domain/ebd/dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from '../../domain/ebd/dto/create-ebd-lesson-response.dto';
import { CreateEbdLessonPassageDTO } from '../../domain/ebd/dto/create-ebd-lesson-passage.dto';
import { CreateEbdLessonPassageResponseDTO } from '../../domain/ebd/dto/create-ebd-lesson-passage-response.dto';
import { GetEbdLessonsDTO } from '../../domain/ebd/dto/get-ebd-lesson.dto';
import { PutEbdLessonDTO } from '../../domain/ebd/dto/put-ebd-lesson.dto';
import { PutEbdLessonResponseDTO } from '../../domain/ebd/dto/put-ebd-lesson.dto.response';
import { EbdLesson } from '../../domain/ebd/entities/ebd-lesson.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdLessonRepository implements IEbdLessonRepository {
  constructor(private httpClient: HttpClient) {}

  public getEbdLessons(props: GetEbdLessonsDTO): Observable<EbdLesson[]> {
    const url = `${environment.apiBaseURL}/ebd/lesson/group/${props.group_id}`;

    return this.httpClient.get<EbdLesson[]>(url);
  }

  public postEbdLesson(props: CreateEbdLessonDTO): Observable<CreateEbdLessonResponseDTO> {
    const url = environment.apiBaseURL + '/ebd/lesson';

    const body = {
      group_id: props.group_id,
      title: props.title,
      done: props.done,
      display_order: props.display_order,
    };

    return this.httpClient.post<CreateEbdLessonResponseDTO>(url, body);
  }

  public postEbdLessonPassage(
    props: CreateEbdLessonPassageDTO,
  ): Observable<CreateEbdLessonPassageResponseDTO> {
    const url = environment.apiBaseURL + '/ebd/lesson/passage';

    const body = {
      lesson_id: props.lesson_id,
      book_id: props.book_id,
      chapter: props.chapter,
      verse_start: props.verse_start,
      verse_end: props.verse_end,
    };

    return this.httpClient.post<CreateEbdLessonPassageResponseDTO>(url, body);
  }

  public putEbdLesson(id: string, props: PutEbdLessonDTO): Observable<PutEbdLessonResponseDTO> {
    const url = `${environment.apiBaseURL}/ebd/lesson/${id}`;

    const body = {
      title: props.title,
      done: props.done,
      display_order: props.display_order,
    };

    return this.httpClient.put<PutEbdLessonResponseDTO>(url, body);
  }
}
