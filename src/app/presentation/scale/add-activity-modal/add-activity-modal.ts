import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Address } from '../../../domain/addresses';
import { Container } from '../../../util/container.service';
import { ButtonComponent } from '../../common/button/button.component';
import { CardComponent } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { SelectComponent } from '../../common/select/select';
import { AddressList } from '../../schedule/address-list/address-list';
import { SearchMembersComponent } from '../search-members/search-members.component';
import { AddressDescriptionPipe } from '../../../pipes/address-description.pipe';
import { ParseTimePipe } from '../../../pipes/parse-time.pipe';
import { ParseDatePipe } from '../../../pipes/parse-date.pipe';
import { AlertService } from '../../common/alert/alert.service';
import { WeekDayPicker } from '../../common/week-day-picker/week-day-picker';

export const WEEK_DAYS = [
  { label: 'Dom', value: 'dom' },
  { label: 'Seg', value: 'seg' },
  { label: 'Ter', value: 'ter' },
  { label: 'Qua', value: 'qua' },
  { label: 'Qui', value: 'qui' },
  { label: 'Sex', value: 'sex' },
  { label: 'Sáb', value: 'sab' },
];

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule, CardComponent, AddressDescriptionPipe, SelectComponent, WeekDayPicker],
  templateUrl: './add-activity-modal.html',
  styleUrl: './add-activity-modal.scss',
})
export class AddActivityModal implements OnInit {
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly fb = inject(FormBuilder);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  private readonly parseTimePipe = new ParseTimePipe();
  private readonly parseDatePipe = new ParseDatePipe();

  public readonly address = input<Address | null>(null);
  protected readonly currentAddress = signal<Address | null>(null);

  public loading = false;

  protected readonly weekDays = WEEK_DAYS;
  protected selectedWeekDays: string[] = [];

  protected readonly activityTypeOptions = [
    { label: 'Pontual', value: 'pontual' },
    { label: 'Fixa (recorrente)', value: 'fixa' },
  ];

  protected readonly participantLimitOptions = [
    { label: 'Ilimitado', value: 'ilimitado' },
    { label: 'Limitado', value: 'limitado' },
  ];

  protected readonly participationOptions = [
    { label: 'Atividade livre', value: 'livre' },
    { label: 'Somente admin', value: 'admin' },
  ];

  public readonly form = this.fb.group({
    title: ['', Validators.required],
    date: [''],
    startTime: [''],
    endTime: [''],
    activityType: ['pontual'],
    participantLimit: ['ilimitado'],
    maxParticipants: [null as number | null],
    participation: ['livre'],
  });

  protected get isFixa(): boolean {
    return this.form.controls.activityType.value === 'fixa';
  }

  protected get isLimited(): boolean {
    return this.form.controls.participantLimit.value === 'limitado';
  }

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

  protected async onConfirm(): Promise<void> {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const addr = this.currentAddress();
    if (!addr) return;

    const link = await this.alertService.openAlert({ message: 'Deseja adicionar participantes?' });

    if (link) {
      const ref = this.container.vcr?.createComponent(SearchMembersComponent);
      ref?.instance.closed.subscribe(() => this.modal.closeModal());
    } else {
      this.modal.closeModal();
    }
  }

  protected onCancel(): void {
    this.modal.closeModal();
  }

}
