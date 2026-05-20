import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePrayDTO, GetPrayDTO, IPrayRepository, Pray } from '../../domain/pray';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrayRepository implements IPrayRepository {
  constructor(private httpClient: HttpClient) {}

  public getPray(props: GetPrayDTO): Observable<Pray[]> {
    const url = environment.apiBaseURL + '/registers/2';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
        limit: String(props.limit ?? 10),
        offset: String(props.offset ?? 0),
      },
    });

    return this.httpClient.get<Pray[]>(url, { params });
  }

  public deletePray(id: string): Observable<void> {
    const url = environment.apiBaseURL + `/registers/${id}`;

    return this.httpClient.delete<void>(url);
  }

  public createPray(props: CreatePrayDTO): Observable<{ id?: string }> {
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
