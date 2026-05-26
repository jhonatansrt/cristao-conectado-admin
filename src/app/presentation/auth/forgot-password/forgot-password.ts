import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AuthService } from '../../../application/auth/auth-service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  imports: [InputComponent, ModalComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public currentStep = 1;
  public isLoading = false;

  public emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public resetForm = this.fb.group({
    code: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public isPasswordMatch(): boolean {
    return (
      this.resetForm.controls.password.value ===
      this.resetForm.controls.confirmPassword.value
    );
  }

  public onSendEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const { email } = this.emailForm.getRawValue();

    this.isLoading = true;

    this.authService
      .forgotPassword({ email: email ?? '' })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => (this.currentStep = 2));
  }

  public onResetPassword(): void {
    if (this.resetForm.invalid || !this.isPasswordMatch()) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { code, password } = this.resetForm.getRawValue();

    this.isLoading = true;

    this.authService
      .resetPassword({ token: code ?? '', password: password ?? '' })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => this.closeModal());
  }
}
