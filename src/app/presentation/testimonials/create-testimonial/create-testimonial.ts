import { Component, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { TestimonialsService } from '../../../application/testimonials/testimonials-service';

@Component({
  selector: 'app-create-testimonial',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-testimonial.html',
  styleUrl: './create-testimonial.scss',
})
export class CreateTestimonial {
  private readonly fb = inject(FormBuilder);
  private readonly testimonialsService = inject(TestimonialsService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public testimonialCreated = output<void>();
  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description } = this.form.getRawValue();

    this.loading = true;
    this.testimonialsService
      .createTestimonial({
        title: title ?? '',
        description: description ?? '',
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.testimonialCreated.emit();
        this.modal?.closeModal();
      });
  }
}
