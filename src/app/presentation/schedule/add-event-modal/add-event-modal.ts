import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { SchedulesService } from '../../../application/schedules/schedules-service';
import { SchedulesStore } from '../../../application/schedules/schedules-store';
import { Address } from '../../../domain/addresses';
import { Container } from '../../../util/container.service';
import { ButtonComponent } from '../../common/button/button.component';
import { CardComponent } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { SelectComponent } from '../../common/select/select';
import { AddressList } from '../address-list/address-list';
import { AddressDescriptionPipe } from '../../../pipes/address-description.pipe';
import { ParseTimePipe } from '../../../pipes/parse-time.pipe';
import { ParseDatePipe } from '../../../pipes/parse-date.pipe';

export interface EditScheduleData {
  scheduleId: string;
  title: string;
  description: string;
  hourInitial: number;
  hourFinal: number;
  day?: number;
  scheduleDate?: string;
}

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
    AddressDescriptionPipe,
  ],
  templateUrl: './add-event-modal.html',
  styleUrl: './add-event-modal.scss',
})
export class AddEventModal implements OnInit {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly fb = inject(FormBuilder);
  private readonly container = inject(Container);
  private readonly schedulesService = inject(SchedulesService);
  private readonly parseTimePipe = new ParseTimePipe();
  private readonly parseDatePipe = new ParseDatePipe();
  protected readonly schedulesStore = inject(SchedulesStore);

  public readonly address = input<Address | null>(null);
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
    this.initAddress();

    const edit = this.schedulesStore.getScheduleToEdit()();

    if (edit) {
      this.form.patchValue({
        title: edit.title,
        description: edit.description,
        startTime: this.formatTime(edit.hourInitial),
        endTime: this.formatTime(edit.hourFinal),
        isFixed: edit.scheduleDate ? 'false' : 'true',
        dayOfWeek: !edit.scheduleDate && edit.day !== undefined ? String(edit.day) : '',
        date: edit.scheduleDate ? this.formatDateToInput(edit.scheduleDate) : '',
      });
    }
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
    this.modal.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const addr = this.currentAddress();

    if (!addr) {
      return;
    }

    const { title, description, startTime, endTime, dayOfWeek, date } = this.form.getRawValue();
    const edit = this.schedulesStore.getScheduleToEdit()();

    const scheduleParams = {
      addressId: addr.id,
      title: title ?? '',
      description: description ?? '',
      hourInitial: this.parseTimePipe.transform(startTime ?? ''),
      hourFinal: this.parseTimePipe.transform(endTime ?? ''),
      ...(this.isFixed
        ? { day: Number(dayOfWeek) }
        : { scheduleDate: this.parseDatePipe.transform(date ?? ''), day: this.getDayOfWeek(date ?? '') }),
    };

    this.loading = true;
    const request$ = edit
      ? this.schedulesService.updateSchedule(edit.scheduleId, scheduleParams)
      : this.schedulesService.createSchedule(scheduleParams);

    request$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.refreshSchedules();
        this.schedulesStore.setScheduleToEdit(null);
        this.modal.closeModal();
        if (edit) {
          this.schedulesService.getScheduleDetails(edit.scheduleId).subscribe();
        }
      },
      error: () => {},
    });
  }

  protected onCancel(): void {
    this.schedulesStore.setScheduleToEdit(null);
    this.modal.closeModal();
  }

  private refreshSchedules(): void {
    this.schedulesService
      .getMonthSchedules(
        this.schedulesStore.getCurrentMonth()(),
        this.schedulesStore.getCurrentYear()(),
      )
      .subscribe();

    const selectedDate = this.schedulesStore.getSelectedDate()();
    if (!selectedDate) {
      return;
    }

    this.schedulesService.getDaySchedules(selectedDate.iso, selectedDate.weekDay).subscribe();
  }

  private getDayOfWeek(value: string): number {
    const [day, month, year] = value.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day)).getDay();
  }

  private formatTime(value: number): string {
    const str = String(value).padStart(4, '0');
    return `${str.slice(0, 2)}:${str.slice(2)}`;
  }

  private formatDateToInput(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
}
