import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdGroupRepository } from '../../domain/ebd/ebd-group.repository';
import { CreateEbdGroupDTO } from '../../domain/ebd/dto/create-ebd-group.dto';
import { CreateEbdGroupResponseDTO } from '../../domain/ebd/dto/create-ebd-group-response.dto';

@Injectable({
  providedIn: 'root',
})
export class EbdGroupRepository implements IEbdGroupRepository {
  constructor(private httpClient: HttpClient) {}

  public postEbdGroup(props: CreateEbdGroupDTO): Observable<CreateEbdGroupResponseDTO> {
    const url = environment.apiBaseURL + '/ebd/group';

    const body = {
      church_id: props.church_id,
      name: props.name,
      type: props.type,
      school_year: props.school_year,
      student_limit: props.student_limit,
      class_id: props.class_id,
      teacher_id: props.teacher_id,
    };

    return this.httpClient.post<CreateEbdGroupResponseDTO>(url, body);
  }
}
