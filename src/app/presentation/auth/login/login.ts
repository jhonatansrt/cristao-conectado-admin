import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../../application/auth/auth-service';
import { namedRoutes } from '../../../named-routes';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { Container } from '../../../util/container.service';
import { CreateAccount } from '../create-account/create-account';
import { ForgotPassword } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly container = inject(Container);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public isLoading = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public openCreateAccount(): void {
    this.container.vcr?.createComponent(CreateAccount);
  }

  public openForgotPassword(): void {
    this.container.vcr?.createComponent(ForgotPassword);
  }

  public onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading = true;

    this.authService
      .createSession({ email: email ?? '', password: password ?? '', is_web: true })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: async () => {
          await this.router.navigate([namedRoutes.schedule]);
        },
        error: () => {},
      });
  }
}
