import { Observable } from 'rxjs';
import { CreateChurchDTO } from './dto/create-church';
import { GetChurchDTO } from './dto/get-church';
import { Church } from './entities/church.entity';
import { ChurchType } from './entities/churchType.entity';
import { UpadteImageDTO } from './dto/update-image';
import { UpdateImageApiResponse } from './dto/update-image-response';

export abstract class IChurchRepository {
  abstract getChurch(props: GetChurchDTO): Observable<Church[]>;
  abstract createChurch(props: CreateChurchDTO): Observable<Church>;
  abstract updateChurch(id: string, props: CreateChurchDTO): Observable<Church>;
  abstract deleteChurch(id: string): Observable<void>;
  abstract listChurchType(): Observable<ChurchType[]>;
  abstract findById(props: GetChurchDTO): Observable<Church>;
  abstract updateChurchIcon(id: string, props: UpadteImageDTO): Observable<UpdateImageApiResponse>;
  abstract updateChurchBanner(id: string, props: UpadteImageDTO): Observable<UpdateImageApiResponse>;
}
