import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetNoticesDTO, INoticesRepository, Notice } from '../../domain/notices';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoticesRepository implements INoticesRepository {
  constructor(private httpClient: HttpClient) {}

  public getNotices(props: GetNoticesDTO): Observable<Notice[]> {
    const url = environment.apiBaseURL + '/registers/0';
    const params = new HttpParams({
      fromObject: {
        churchId: props.churchId,
        limit: String(props.limit ?? 10),
        offset: String(props.offset ?? 0),
      },
    });

    return this.httpClient.get<Notice[]>(url, { params });
  }
}
