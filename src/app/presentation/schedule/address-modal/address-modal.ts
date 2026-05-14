import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-address-modal',
  imports: [MatIconModule, ModalComponent],
  templateUrl: './address-modal.html',
  styleUrl: './address-modal.scss',
})
export class AddressModal {
  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public readonly existingAddresses = [1, 2, 3];

  public closeModal(): void {
    this.modal?.closeModal();
  }
}
