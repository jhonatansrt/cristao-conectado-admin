import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Church, ChurchType, CreateChurchDTO, GetChurchDTO, IChurchRepository } from '../../domain/church';

@Injectable({
  providedIn: 'root',
})
export class ChurchRepository implements IChurchRepository {
  constructor(private httpClient: HttpClient) {}

  public getChurch(props: GetChurchDTO): Observable<Church[]> {
    const url = environment.apiBaseURL + '/church';
    const params = new HttpParams({ fromObject: { church_id: props.churchId } });
    return this.httpClient.get<Church[]>(url, { params });
  }

  public createChurch(props: CreateChurchDTO): Observable<Church> {
    const url = environment.apiBaseURL + '/church';
    const body = {
        phone: props.phone,
        name: props.name,
        address_id: props.address_id,
        facebook: props.facebook,
        instagram: props.instagram,
        youtube: props.youtube,
        type_id: props.type_id
    };
    return this.httpClient.post<Church>(url, body);
  }

  public updateChurch(id: string, props: CreateChurchDTO): Observable<Church> {
    const url = `${environment.apiBaseURL}/church/${id}/`;
    const body = {
        phone: props.phone,
        name: props.name,
        address_id: props.address_id,
        facebook: props.facebook,
        instagram: props.instagram,
        youtube: props.youtube,
        type_id: props.type_id
    };
    return this.httpClient.put<Church>(url, body);
  }

  public deleteChurch(id: string): Observable<void> {
    const url = `${environment.apiBaseURL}/church/${id}/`;
    return this.httpClient.delete<void>(url);
  }

public listChurchType(): Observable<ChurchType[]> {
    const url = environment.apiBaseURL + '/church/findType';
    const params = new HttpParams({ fromObject: { } });
    return this.httpClient.get<Church[]>(url, { params });
  }

  public findById(props: GetChurchDTO){
    const url = environment.apiBaseURL + '/church/findById';
    const params = new HttpParams({ fromObject: { church_id: props.churchId } });
    return this.httpClient.get<Church>(url, { params });
  }
}
