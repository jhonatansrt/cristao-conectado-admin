import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { Container } from '../../../util/container.service';
import { CreateAccount } from '../create-account/create-account';
import { ForgotPassword } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly container = inject(Container);

  public openCreateAccount(event: Event): void {
    event.preventDefault();
    this.container.vcr?.createComponent(CreateAccount);
  }
  public openForgotPassword(event: Event): void {
    event.preventDefault();
    this.container.vcr?.createComponent(ForgotPassword);
  }

}

