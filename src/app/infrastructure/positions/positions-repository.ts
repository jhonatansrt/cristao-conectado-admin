import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePositionDTO,
  GetPositionsDTO,
  IPositionsRepository,
  Position,
  UpdatePositionDTO,
} from '../../domain/positions';

@Injectable({
  providedIn: 'root',
})
export class PositionsRepository implements IPositionsRepository {
  constructor(private httpClient: HttpClient) {}

 

 

  public getPositions(props: GetPositionsDTO): Observable<any[]> {
    const url = `${environment.apiBaseURL}/members/memberPosition/${props.churchId}`;

    return this.httpClient.get<any[]>(url);
  }

  public createPosition(props: CreatePositionDTO): Observable<Position> {
    const url = environment.apiBaseURL + '/members/memberPosition';
    const body = {
      name: props.name,
      church_id: props.churchId,
    };
    return this.httpClient.post<Position>(url, body);
  }

  public updatePosition(id: string, props: UpdatePositionDTO): Observable<void> {
    return of(void 0);
  }

  public deletePosition(id: string): Observable<void> {
    return of(void 0);
  }
}
