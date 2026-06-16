import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Address } from '../../../domain/addresses';
import { Container } from '../../../util/container.service';
import { ButtonComponent } from '../../common/button/button.component';
import { CardComponent } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { AddressList } from '../../schedule/address-list/address-list';
import { SearchMembersComponent } from '../search-members/search-members.component';
import { AddressDescriptionPipe } from '../../../pipes/address-description.pipe';
import { ParseTimePipe } from '../../../pipes/parse-time.pipe';
import { ParseDatePipe } from '../../../pipes/parse-date.pipe';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule, CardComponent, AddressDescriptionPipe],
  templateUrl: './add-activity-modal.html',
  styleUrl: './add-activity-modal.scss',
})
export class AddActivityModal implements OnInit {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly fb = inject(FormBuilder);
  private readonly container = inject(Container);
  private readonly parseTimePipe = new ParseTimePipe();
  private readonly parseDatePipe = new ParseDatePipe();

  public readonly address = input<Address | null>(null);
  protected readonly currentAddress = signal<Address | null>(null);

  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    date: [''],
    startTime: [''],
    endTime: [''],
  });

  ngOnInit(): void {
    this.initAddress();
  }

  private initAddress(): void {
    const addr = this.address();
    if (addr) {
      this.currentAddress.set(addr);
    }
  }

  protected onChangeAddress(): void {
    const listRef = this.container.vcr?.createComponent(AddressList);
    listRef?.instance.addressSelected.subscribe((address) => {
      this.currentAddress.set(address);
    });
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const addr = this.currentAddress();
    if (!addr) return;

    this.container.vcr?.createComponent(SearchMembersComponent);
  }

  protected onCancel(): void {
    this.modal.closeModal();
  }

}
