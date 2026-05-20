import { Observable } from 'rxjs';
import { CreatePrayDTO } from './dto/create-pray.dto';
import { GetPrayDTO } from './dto/get-pray.dto';
import { Pray } from './entities/pray.entity';

export abstract class IPrayRepository {
  abstract getPray(props: GetPrayDTO): Observable<Pray[]>;
  abstract createPray(props: CreatePrayDTO): Observable<{ id?: string }>;
  abstract deletePray(id: string): Observable<void>;
}
