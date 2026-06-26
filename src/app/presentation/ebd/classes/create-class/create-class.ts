import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';

export interface EbdClassData {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

@Component({
  selector: 'app-create-class',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.scss',
})
export class CreateClass implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input() public ebdClass?: EbdClassData;

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly form = this.fb.group({
    name: ['', Validators.required],
    minAge: ['', [Validators.required, Validators.min(0)]],
    maxAge: ['', [Validators.required, Validators.min(0)]],
  });

  protected get title(): string {
    return this.ebdClass ? 'Editar classe' : 'Adicionar classe';
  }

  ngOnInit(): void {
    if (this.ebdClass) {
      this.form.patchValue({
        name: this.ebdClass.name,
        minAge: String(this.ebdClass.minAge),
        maxAge: String(this.ebdClass.maxAge),
      });
    }
  }

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Mock: nenhuma integração por enquanto, apenas fecha o modal.
    this.modal?.closeModal();
  }
}
