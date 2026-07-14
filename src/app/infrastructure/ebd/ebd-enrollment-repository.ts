import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IEbdEnrollmentRepository } from '../../domain/ebd/ebd-enrollment.repository';
import { GetEbdEnrollmentsDTO } from '../../domain/ebd/dto/get-ebd-enrollment.dto';
import { EbdEnrollment } from '../../domain/ebd/entities/ebd-enrollment.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdEnrollmentRepository implements IEbdEnrollmentRepository {
  constructor(private httpClient: HttpClient) {}

  public getEbdEnrollments(props: GetEbdEnrollmentsDTO): Observable<EbdEnrollment[]> {
    const url = `${environment.apiBaseURL}/ebd/enrollment/group/${props.group_id}`;

    return this.httpClient.get<EbdEnrollment[]>(url);
  }
}
