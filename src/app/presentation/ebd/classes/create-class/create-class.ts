import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../common/button/button.component';
import { InputComponent } from '../../../common/input/input';
import { ModalComponent } from '../../../common/modal/modal.component';
import { ClassesStore } from '../../../../application/ebd/classes-store';

@Component({
  selector: 'app-create-class',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-class.html',
  styleUrl: './create-class.scss',
})
export class CreateClass implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly classesStore = inject(ClassesStore);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly form = this.fb.group({
    name: ['', Validators.required],
    minAge: ['', [Validators.required, Validators.min(0)]],
    maxAge: ['', [Validators.required, Validators.min(0)]],
  });

  protected get classSelected() {
    return this.classesStore.getClassSelected()();
  }

  ngOnInit(): void {
    const ebdClass = this.classSelected;

    if (ebdClass) {
      this.form.patchValue({
        name: ebdClass.name,
        minAge: String(ebdClass.minAge),
        maxAge: String(ebdClass.maxAge),
      });
    }
  }

  protected onCancel(): void {
    this.classesStore.setClassSelected(null);
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, minAge, maxAge } = this.form.getRawValue();
    const selected = this.classSelected;

    const payload = {
      name: name ?? '',
      minAge: Number(minAge),
      maxAge: Number(maxAge),
    };

    if (selected) {
      this.classesStore.updateClass({ ...payload, id: selected.id });
    } else {
      this.classesStore.addClass(payload);
    }

    this.classesStore.setClassSelected(null);
    this.modal?.closeModal();
  }
}
