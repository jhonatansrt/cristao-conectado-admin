import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetMembersDTO, IMembersRepository, Member } from '../../domain/members';
import { UpdateMemberDTO } from '../../domain/members/dto/update-member.dto';

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
  public updateChurchMember(props: UpdateMemberDTO): Observable<void> {
    const url = `${environment.apiBaseURL}/members/${props.id}`;
    const body = {
      position_id: props.position_id, 
      is_active: props.is_active, 
      is_baptized: props.is_baptized, 
      type: props.type, 
      user_id: props.user_id
    };

    return this.httpClient.put<void>(url, body);
  }
}
