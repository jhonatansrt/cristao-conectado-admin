import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetMonthSchedulesDTO, ISchedulesRepository, MonthSchedule } from '../../domain/schedules';

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
}
