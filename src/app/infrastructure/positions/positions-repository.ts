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

  private positions: Position[] = [
    // { id: '1', name: 'Pastor', membersCount: 2 },
    // { id: '2', name: 'Líder de louvor', membersCount: 5 },
    // { id: '3', name: 'Diácono', membersCount: 8 },
    // { id: '4', name: 'Voluntário de mídia', membersCount: 12 },
  ];

  public getPositions(_props: GetPositionsDTO): Observable<Position[]> {
    return of(this.positions);
  }

  // public createPosition(props: CreatePositionDTO): Observable<{ id?: string }> {
  //   const id = crypto.randomUUID();
  //   this.positions = [...this.positions, { id, name: props.name, membersCount: 0 }];

  //   return of({ id });
  // }

  public getMemberPositions(props: GetPositionsDTO): Observable<any[]> {
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
    this.positions = this.positions.map((position) =>
      position.id === id ? { ...position, name: props.name } : position,
    );

    return of(void 0);
  }

  public deletePosition(id: string): Observable<void> {
    this.positions = this.positions.filter((position) => position.id !== id);

    return of(void 0);
  }
}
