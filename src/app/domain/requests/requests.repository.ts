import { Observable } from 'rxjs';
import { GetUserChurchRequestsDTO } from './dto/get-user-church-requests.dto';
import { UserChurchRequest } from './entities/user-church-request.entity';

export abstract class IRequestsRepository {
  abstract getPendingRequestsByChurch(props: GetUserChurchRequestsDTO): Observable<UserChurchRequest[]>;
}
