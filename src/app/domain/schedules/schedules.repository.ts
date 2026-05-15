import { Observable } from 'rxjs';
import { GetDaySchedulesDTO } from './dto/get-day-schedules.dto';
import { GetMonthSchedulesDTO } from './dto/get-month-schedules.dto';
import { DaySchedule } from './entities/day-schedule.entity';
import { MonthSchedule } from './entities/month-schedule.entity';

export abstract class ISchedulesRepository {
  abstract getMonthSchedules(props: GetMonthSchedulesDTO): Observable<MonthSchedule[]>;
  abstract getDaySchedules(props: GetDaySchedulesDTO): Observable<DaySchedule[]>;
}
