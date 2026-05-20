import { Component, OnInit, ViewChild, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { NoticesService } from '../../../application/notices/notices-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-create-notice',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-notice.html',
  styleUrl: './create-notice.scss',
})
export class CreateNotice implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly noticesService = inject(NoticesService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public noticeCreated = output<void>();
  public loading = false;
  public readonly registerId = input<string>();
  public readonly initialTitle = input<string>('');
  public readonly initialDescription = input<string>('');

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    this.form.patchValue({
      title: this.initialTitle(),
      description: this.initialDescription(),
    });
  }

  protected modalTitle(): string {
    return this.registerId() ? 'Editar aviso' : 'Adicionar aviso';
  }

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
    this.noticesService
      .createNotice({
        id: this.registerId(),
        title: title ?? '',
        description: description ?? '',
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.noticeCreated.emit();
        this.modal?.closeModal();
      });
  }
}
