import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../common/modal/modal.component';
import { ButtonComponent } from '../common/button/button.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public closeModal(): void {
    this.modal?.closeModal();
  }
}
