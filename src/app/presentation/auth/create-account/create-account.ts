import { Component, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-create-account',
  imports: [InputComponent, ModalComponent, ButtonComponent],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
})
export class CreateAccount {
  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public closeModal(): void {
    this.modal?.closeModal();
  }
}
