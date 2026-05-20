import { Observable } from 'rxjs';
import { CreateNoticeDTO } from './dto/create-notice.dto';
import { GetNoticesDTO } from './dto/get-notices.dto';
import { Notice } from './entities/notice.entity';

export abstract class INoticesRepository {
  abstract getNotices(props: GetNoticesDTO): Observable<Notice[]>;
  abstract createNotice(props: CreateNoticeDTO): Observable<{ id?: string }>;
}
