import { Observable } from 'rxjs';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { GetDaySchedulesDTO } from './dto/get-day-schedules.dto';
import { GetMonthSchedulesDTO } from './dto/get-month-schedules.dto';
import { DaySchedule } from './entities/day-schedule.entity';
import { MonthSchedule } from './entities/month-schedule.entity';
import { ScheduleDetails } from './entities/schedule-details.entity';

export abstract class ISchedulesRepository {
  abstract createSchedule(props: CreateScheduleDTO): Observable<void>;
  abstract getMonthSchedules(props: GetMonthSchedulesDTO): Observable<MonthSchedule[]>;
  abstract getDaySchedules(props: GetDaySchedulesDTO): Observable<DaySchedule[]>;
  abstract getScheduleDetails(id: string): Observable<ScheduleDetails>;
}
