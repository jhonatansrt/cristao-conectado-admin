import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../application/auth/auth-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-update-password',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.scss',
})
export class UpdatePassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public isLoading = false;

  public readonly updatePasswordForm = this.fb.group({
    password: [''],
    newPassword: [''],
    newPasswordConfirmation: [''],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onConfirm(): void {
    const { password, newPassword, newPasswordConfirmation } = this.updatePasswordForm.getRawValue();

    if (!password || !newPassword || !newPasswordConfirmation) return;

    this.isLoading = true;
    this.authService.updatePassword({ password, newPassword, newPasswordConfirmation })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.closeModal());
  }
}
