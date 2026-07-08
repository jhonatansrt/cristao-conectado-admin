import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdClassRepository } from '../../domain/ebd/ebd-class.repository';
import { CreateEbdClassDTO } from '../../domain/ebd/dto/create-ebd-class.dto';
import { CreateEbdClassResponseDTO } from '../../domain/ebd/dto/create-ebd-class-response.dto';
import { GetEbdClassesDTO } from '../../domain/ebd/dto/get-ebd-class.dto';
import { EbdClass } from '../../domain/ebd/entities/ebd-class.entity';
import { PutEbdClassDTO } from '../../domain/ebd/dto/put-ebd-class.dto';

@Injectable({
  providedIn: 'root',
})
export class EbdClassRepository implements IEbdClassRepository {
  constructor(private httpClient: HttpClient) {}

  public postEbdClass(props: CreateEbdClassDTO): Observable<CreateEbdClassResponseDTO> {
    const url = environment.apiBaseURL + '/ebd/class';

    const body = {
      church_id: props.church_id,
      name: props.name,
      min_age: props.min_age,
      max_age: props.max_age,
    };

    return this.httpClient.post<CreateEbdClassResponseDTO>(url, body);
  }

  public getEbdClass(props: GetEbdClassesDTO) {
    const url = `${environment.apiBaseURL}/ebd/class/church/${props.church_id}`;

    return this.httpClient.get<EbdClass[]>(url);
  }

  public putEbdClass(id: string, props: PutEbdClassDTO) {
    const url = `${environment.apiBaseURL}/ebd/class/church/${id}`;

    const body = {
      name: props.name,
      min_age: props.min_age,
      max_age: props.max_age,
    };

    return this.httpClient.put<EbdClass[]>(url, body);
  }
}
