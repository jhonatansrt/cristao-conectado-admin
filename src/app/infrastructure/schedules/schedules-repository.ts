import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DaySchedule, GetDaySchedulesDTO, GetMonthSchedulesDTO, ISchedulesRepository, MonthSchedule } from '../../domain/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesRepository implements ISchedulesRepository {
  constructor(private httpClient: HttpClient) {}

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

    return this.httpClient.post<DaySchedule[]>(url, { date: props.date }, { params });
  }
}
