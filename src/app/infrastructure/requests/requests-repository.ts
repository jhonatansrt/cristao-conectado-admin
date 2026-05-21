import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GetUserChurchRequestsDTO,
  IRequestsRepository,
  ReviewUserChurchRequestDTO,
  UserChurchRequest,
} from '../../domain/requests';

@Injectable({
  providedIn: 'root',
})
export class RequestsRepository implements IRequestsRepository {
  constructor(private httpClient: HttpClient) {}

  public getPendingRequestsByChurch(props: GetUserChurchRequestsDTO): Observable<UserChurchRequest[]> {
    const url = `${environment.apiBaseURL}/userChurchRequest`;
    const params = new HttpParams({ fromObject: { church_id: props.churchId } });

    return this.httpClient.get<UserChurchRequest[]>(url, { params });
  }

  public reviewUserChurchRequest(props: ReviewUserChurchRequestDTO): Observable<unknown> {
    const url = `${environment.apiBaseURL}/userChurchRequest/review`;

    return this.httpClient.post<unknown>(url, props);
  }
}
