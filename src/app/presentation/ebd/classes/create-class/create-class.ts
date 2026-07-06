import { Component, Input, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { EbdClassService } from '../../../../application/ebd-class/ebd-class.service';
import { EbdClass } from '../../../../domain/ebd/entities/ebd-class.entity';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-class',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.scss',
})
export class CreateClass implements OnInit {
  private readonly fb = inject(FormBuilder);

  public ebdClassCreated = output<void>();

  private readonly ebdClassService = inject(EbdClassService);

  @Input() public ebdClass?: EbdClass;

  public loading = false;

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly form = this.fb.group({
    name: ['', Validators.required],
    min_age: ['', [Validators.required, Validators.min(0)]],
    max_age: ['', [Validators.required, Validators.min(0)]],
  });

  protected get title(): string {
    return this.ebdClass ? 'Editar classe' : 'Adicionar classe';
  }

  ngOnInit(): void {
    if (this.ebdClass) {
      this.form.patchValue({
        name: this.ebdClass.name,
        min_age: String(this.ebdClass.min_age),
        max_age: String(this.ebdClass.max_age),
      });
    }
  }

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, min_age, max_age } = this.form.getRawValue();

    this.loading = true;
    this.ebdClassService
      .createEbdClass({
        name: name ?? '',
        min_age: Number(min_age) || 0,
        max_age: Number(max_age) || 0,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.ebdClassCreated.emit();
        this.modal?.closeModal();
      });
  }
}
