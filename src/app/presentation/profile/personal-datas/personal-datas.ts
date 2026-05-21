import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { AuthStore } from '../../../application/auth/auth-store';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-personal-datas',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './personal-datas.html',
  styleUrl: './personal-datas.scss',
})
export class PersonalDatas {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  private readonly userLogged = this.authStore.getUserLogged();

  public readonly personalDatasForm = this.fb.group({
    email: [{ value: this.userLogged()?.email ?? '', disabled: true }],
    name: [this.userLogged()?.name ?? ''],
    birthDate: [this.userLogged()?.birth_date ?? ''],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    this.closeModal();
  }
}
