import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateScheduleDTO, DaySchedule, GetDaySchedulesDTO, GetMonthSchedulesDTO, ISchedulesRepository, MonthSchedule, ScheduleDetails } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesRepository implements ISchedulesRepository {
  constructor(private httpClient: HttpClient) {}

  public createSchedule(props: CreateScheduleDTO): Observable<void> {
    const url = environment.apiBaseURL + '/schedules';
    const body: Record<string, unknown> = {
      address_id: props.addressId,
      title: props.title,
      description: props.description,
      hour_initial: props.hourInitial,
      hour_final: props.hourFinal,
      church_id: props.churchId,
    };

    if (props.day !== undefined) {
      body['day'] = props.day;
    } else {
      body['schedule_date'] = props.scheduleDate;
    }

    return this.httpClient.post<void>(url, body).pipe(map(() => void 0));
  }

  public getMonthSchedules(props: GetMonthSchedulesDTO): Observable<MonthSchedule[]> {
    const url = environment.apiBaseURL + '/schedules/month';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
        month: String(props.month),
        year: String(props.year),
      },
    });

    return this.httpClient.get<MonthSchedule[]>(url, { params });
  }

  public getDaySchedules(props: GetDaySchedulesDTO): Observable<DaySchedule[]> {
    const url = environment.apiBaseURL + '/schedules/day';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
      },
    });

    return this.httpClient.post<DaySchedule[]>(url, { date: props.date, day: props.day }, { params });
  }

  public getScheduleDetails(id: string): Observable<ScheduleDetails> {
    const url = `${environment.apiBaseURL}/schedules/details/${id}`;
    return this.httpClient.get<ScheduleDetails>(url);
  }
}
