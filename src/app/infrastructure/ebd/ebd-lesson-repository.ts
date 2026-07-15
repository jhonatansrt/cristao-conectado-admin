import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdLessonRepository } from '../../domain/ebd/ebd-lesson.repository';
import { CreateEbdLessonDTO } from '../../domain/ebd/dto/create-ebd-lesson.dto';
import { CreateEbdLessonResponseDTO } from '../../domain/ebd/dto/create-ebd-lesson-response.dto';

@Injectable({
  providedIn: 'root',
})
export class EbdLessonRepository implements IEbdLessonRepository {
  constructor(private httpClient: HttpClient) {}

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
