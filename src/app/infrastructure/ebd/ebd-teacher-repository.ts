import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdTeacherRepository } from '../../domain/ebd/ebd-teacher.repository';
import { CreateEbdTeacherDTO } from '../../domain/ebd/dto/create-ebd-teacher.dto';
import { CreateEbdTeacherResponseDTO } from '../../domain/ebd/dto/create-ebd-teacher-response.dto';

@Injectable({
  providedIn: 'root',
})
export class EbdTeacherRepository implements IEbdTeacherRepository {
  constructor(private httpClient: HttpClient) {}

  public postEbdTeacher(props: CreateEbdTeacherDTO): Observable<CreateEbdTeacherResponseDTO> {
    const url = environment.apiBaseURL + '/ebd/teacher';

    const body = {
      church_id: props.church_id,
      member_id: props.member_id,
    };

    return this.httpClient.post<CreateEbdTeacherResponseDTO>(url, body);
  }
}
