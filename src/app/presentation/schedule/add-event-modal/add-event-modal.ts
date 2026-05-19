import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { Address } from '../../../domain/addresses';
import { Container } from '../../../util/container.service';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { AddressList } from '../address-list/address-list';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-event-modal.html',
  styleUrl: './add-event-modal.scss',
})
export class AddEventModal implements OnInit {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly fb = inject(FormBuilder);
  private readonly container = inject(Container);

  public readonly address = input<Address | null>(null);
  protected readonly currentAddress = signal<Address | null>(null);

  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    isFixed: ['false'],
    date: [''],
    time: [''],
    description: [''],
  });

  ngOnInit(): void {
    const addr = this.address();
    if (addr) {
      this.currentAddress.set(addr);
    }
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();
    if (!addr) return '';
    return `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}`;
  }

  protected onChangeAddress(): void {
    const ref = this.container.vcr?.createComponent(AddressList);
    ref?.instance.addressSelected.subscribe((address: Address) => {
      this.currentAddress.set(address);
    });
  }

  protected onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.modal.closeModal();
  }

  protected onCancel(): void {
    this.modal.closeModal();
  }
}
