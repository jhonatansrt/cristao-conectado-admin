import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  imports: [InputComponent, ModalComponent, ButtonComponent],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public closeModal(): void {
    this.modal?.closeModal();
  }
}
