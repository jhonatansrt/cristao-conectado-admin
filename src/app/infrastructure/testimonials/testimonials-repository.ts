import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTestimonialDTO,
  GetTestimonialsDTO,
  ITestimonialsRepository,
  Testimonial,
} from '../../domain/testimonials';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsRepository implements ITestimonialsRepository {
  constructor(private httpClient: HttpClient) {}

  public getTestimonials(props: GetTestimonialsDTO): Observable<Testimonial[]> {
    const url = environment.apiBaseURL + '/registers/1';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
        limit: String(props.limit ?? 10),
        offset: String(props.offset ?? 0),
      },
    });

    return this.httpClient.get<Testimonial[]>(url, { params });
  }

  public deleteTestimonial(id: string): Observable<void> {
    const url = environment.apiBaseURL + `/registers/${id}`;

    return this.httpClient.delete<void>(url);
  }

  public createTestimonial(props: CreateTestimonialDTO): Observable<{ id?: string }> {
    const url = environment.apiBaseURL + `/registers`;

    return this.httpClient.post<{ id?: string }>(url, {
      type: props.type,
      title: props.title,
      description: props.description,
      church_id: props.churchId,
    });
  }
}
