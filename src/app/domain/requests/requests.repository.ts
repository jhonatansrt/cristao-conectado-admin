import { Observable } from 'rxjs';
import { GetUserChurchRequestsDTO } from './dto/get-user-church-requests.dto';
import { ReviewUserChurchRequestDTO } from './dto/review-user-church-request.dto';
import { UserChurchRequest } from './entities/user-church-request.entity';

export abstract class IRequestsRepository {
  abstract getPendingRequestsByChurch(props: GetUserChurchRequestsDTO): Observable<UserChurchRequest[]>;
  abstract reviewUserChurchRequest(props: ReviewUserChurchRequestDTO): Observable<unknown>;
}
