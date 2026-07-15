import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdLessonRepository } from '../../domain/ebd/ebd-lesson.repository';
import { CreateEbdLessonDTO } from '../../domain/ebd/dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from '../../domain/ebd/dto/create-ebd-lesson-response.dto';
import { GetEbdLessonsDTO } from '../../domain/ebd/dto/get-ebd-lesson.dto';
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
}
