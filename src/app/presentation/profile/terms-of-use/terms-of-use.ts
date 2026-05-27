import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { ButtonComponent } from '../../common/button/button.component';

@Component({
  selector: 'app-terms-of-use',
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './terms-of-use.html',
  styleUrl: './terms-of-use.scss',
})
export class TermsOfUse {
  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public closeModal(): void {
    this.modal?.closeModal();
  }
}
