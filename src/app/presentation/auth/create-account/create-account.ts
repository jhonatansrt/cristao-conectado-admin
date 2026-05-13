import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { AuthService } from '../../../application/auth/auth-service';
import { Router } from '@angular/router';
import { namedRoutes } from '../../../named-routes';

@Component({
  selector: 'app-create-account',
  imports: [InputComponent, ModalComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
})
export class CreateAccount {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public isLoading = false;

  public createAccountForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: [
      '',
      [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)],
    ],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  public closeModal(): void {
    this.modal?.closeModal();
  }

  public onCreateAccount(): void {
    if (this.createAccountForm.invalid || !this.isPasswordMatch()) {
      this.createAccountForm.markAllAsTouched();
      return;
    }

    const { name, email, birthDate, password } = this.createAccountForm.getRawValue();

    this.isLoading = true;

    this.authService
      .createAccount({
        name: name ?? '',
        email: email ?? '',
        birth_date: this.formatBirthDate(birthDate ?? ''),
        password: password ?? '',
      })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async () => {
          this.closeModal();
          await this.router.navigate([namedRoutes.home]);
        },
      });
  }

  public isPasswordMatch(): boolean {
    return (
      this.createAccountForm.controls.password.value ===
      this.createAccountForm.controls.confirmPassword.value
    );
  }

  private formatBirthDate(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
}
