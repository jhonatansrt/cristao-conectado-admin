import { Observable } from 'rxjs';
import { CreatePositionDTO } from './dto/create-position.dto';
import { GetPositionsDTO } from './dto/get-positions.dto';
import { UpdatePositionDTO } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

import { GetMembersDTO } from '../members';

export abstract class IPositionsRepository {
  abstract getPositions(props: GetPositionsDTO): Observable<Position[]>;
  abstract createPosition(props: CreatePositionDTO): Observable<{ id?: string }>;
  abstract getPositions(props: GetMembersDTO): Observable<GetPositionsDTO[]>;
  abstract updatePosition(id: string, props: UpdatePositionDTO): Observable<void>;
  abstract deletePosition(id: string): Observable<void>;
}
