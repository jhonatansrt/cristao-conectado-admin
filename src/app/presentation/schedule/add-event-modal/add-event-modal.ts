import { Component, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { SchedulesService } from '../../../application/schedules/schedules-service';
import { Address } from '../../../domain/addresses';
import { Container } from '../../../util/container.service';
import { ButtonComponent } from '../../common/button/button.component';
import { CardComponent } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { SelectComponent } from '../../common/select/select';
import { AddressList } from '../address-list/address-list';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [
    ModalComponent,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatIconModule,
    SelectComponent,
    CardComponent,
  ],
  templateUrl: './add-event-modal.html',
  styleUrl: './add-event-modal.scss',
})
export class AddEventModal implements OnInit {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly fb = inject(FormBuilder);
  private readonly container = inject(Container);
  private readonly schedulesService = inject(SchedulesService);

  public readonly address = input<Address | null>(null);
  public readonly eventCreated = output<void>();
  protected readonly currentAddress = signal<Address | null>(null);

  public loading = false;

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    isFixed: ['false'],
    date: [''],
    dayOfWeek: [''],
    startTime: [''],
    endTime: [''],
    description: [''],
  });

  protected readonly daysOfWeek = [
    { label: 'Domingo', value: '0' },
    { label: 'Segunda-feira', value: '1' },
    { label: 'Terça-feira', value: '2' },
    { label: 'Quarta-feira', value: '3' },
    { label: 'Quinta-feira', value: '4' },
    { label: 'Sexta-feira', value: '5' },
    { label: 'Sábado', value: '6' },
  ];

  protected get isFixed(): boolean {
    return this.form.controls.isFixed.value === 'true';
  }

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
    this.modal.closeModal();
    // ref?.instance.addressSelected.subscribe((address: Address) => {
    //   this.currentAddress.set(address);
    // });
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const addr = this.currentAddress();
    if (!addr) return;

    const { title, description, startTime, endTime, dayOfWeek, date } = this.form.getRawValue();

    this.loading = true;
    this.schedulesService
      .createSchedule({
        addressId: addr.id,
        title: title ?? '',
        description: description ?? '',
        hourInitial: this.parseTime(startTime ?? ''),
        hourFinal: this.parseTime(endTime ?? ''),
        ...(this.isFixed
          ? { day: Number(dayOfWeek) }
          : { scheduleDate: this.parseDate(date ?? '') }),
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.eventCreated.emit();
        this.modal.closeModal();
      });
  }

  protected onCancel(): void {
    this.modal.closeModal();
  }

  private parseTime(value: string): number {
    return parseInt(value.replace(':', ''), 10) || 0;
  }

  private parseDate(value: string): string {
    const [day, month, year] = value.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
  }
}
