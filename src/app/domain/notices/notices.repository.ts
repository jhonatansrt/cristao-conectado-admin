import { Observable } from 'rxjs';
import { GetNoticesDTO } from './dto/get-notices.dto';
import { Notice } from './entities/notice.entity';

export abstract class INoticesRepository {
  abstract getNotices(props: GetNoticesDTO): Observable<Notice[]>;
}
