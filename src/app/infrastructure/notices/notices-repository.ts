import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateNoticeDTO, GetNoticesDTO, INoticesRepository, Notice } from '../../domain/notices';
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
        church_id: props.churchId,
        limit: String(props.limit ?? 10),
        offset: String(props.offset ?? 0),
      },
    });

    return this.httpClient.get<Notice[]>(url, { params });
  }


  public deleteNotice(id: string): Observable<void> {
    const url = environment.apiBaseURL + `/registers/${id}`;

    return this.httpClient.delete<void>(url);
  }

  public createNotice(props: CreateNoticeDTO): Observable<{ id?: string }> {
    const url = environment.apiBaseURL + `/registers`;
    const params = props.id
      ? new HttpParams({
          fromObject: {
            registerId: props.id,
          },
        })
      : undefined;

    return this.httpClient.post<{ id?: string }>(
      url,
      {
        type: props.type,
        title: props.title,
        description: props.description,
        church_id: props.churchId,
      },
      { params },
    );
  }
}
