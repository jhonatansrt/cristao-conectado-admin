import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../application/auth/auth-service';
import { AuthStore } from '../../../application/auth/auth-store';
import { CapitalizeNamePipe } from '../../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-personal-datas',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  providers: [FormatDatePipe, CapitalizeNamePipe],
  templateUrl: './personal-datas.html',
  styleUrl: './personal-datas.scss',
})
export class PersonalDatas {
  private readonly fb = inject(FormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly authService = inject(AuthService);
  private readonly formatDatePipe = inject(FormatDatePipe);
  private readonly capitalizeNamePipe = inject(CapitalizeNamePipe);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public isLoading = false;

  private readonly userLogged = this.authStore.getUserLogged();

  public readonly personalDatasForm = this.fb.group({
    email: [{ value: this.userLogged()?.email ?? '', disabled: true }],
    name: [this.capitalizeNamePipe.transform(this.userLogged()?.name)],
    birthDate: [this.formatDatePipe.transform(this.userLogged()?.birth_date)],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    const { name, birthDate } = this.personalDatasForm.getRawValue();

    if (!name || !birthDate) return;

    const [day, month, year] = birthDate.split('/');
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();

    this.isLoading = true;
    this.authService.updateUser({ name, birth_date: isoDate })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.closeModal());
  }
}
