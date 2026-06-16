import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GetMembersDTO,
  GetMembersPositionResponseDTO,
  IMembersRepository,
  Member,
} from '../../domain/members';

@Injectable({
  providedIn: 'root',
})
export class MembersRepository implements IMembersRepository {
  constructor(private httpClient: HttpClient) {}

  public getMembersByChurch(props: GetMembersDTO): Observable<Member[]> {
    const url = `${environment.apiBaseURL}/members`;
    const params = new HttpParams({ fromObject: { church_id: props.churchId } });

    return this.httpClient.get<Member[]>(url, { params });
  }

  public getMemberPositions(
    props: GetMembersPositionResponseDTO,
  ): Observable<GetMembersPositionResponseDTO[]> {
    const url = `${environment.apiBaseURL}/members/memberPosition/${props.churchId}`;

    return this.httpClient.get<GetMembersPositionResponseDTO[]>(url);
  }
}
