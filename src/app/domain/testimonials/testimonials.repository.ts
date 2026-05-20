import { Observable } from 'rxjs';
import { CreateTestimonialDTO } from './dto/create-testimonial.dto';
import { GetTestimonialsDTO } from './dto/get-testimonials.dto';
import { Testimonial } from './entities/testimonial.entity';

export abstract class ITestimonialsRepository {
  abstract getTestimonials(props: GetTestimonialsDTO): Observable<Testimonial[]>;
  abstract createTestimonial(props: CreateTestimonialDTO): Observable<{ id?: string }>;
  abstract deleteTestimonial(id: string): Observable<void>;
}
