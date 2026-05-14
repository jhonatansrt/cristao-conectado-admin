import { Observable } from 'rxjs';
import { GetMonthSchedulesDTO } from './dto/get-month-schedules.dto';
import { MonthSchedule } from './entities/month-schedule.entity';

export abstract class ISchedulesRepository {
  abstract getMonthSchedules(props: GetMonthSchedulesDTO): Observable<MonthSchedule[]>;
}
