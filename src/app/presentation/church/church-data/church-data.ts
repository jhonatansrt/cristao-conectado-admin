import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { inject } from '@angular/core';
import { InputComponent } from '../../common/input/input';
import { SelectComponent } from '../../common/select/select';
import { CardComponent } from '../../common/card/card.component';
import { ChurchStore } from '../../../application/church/church-store';
import { ChurchService } from '../../../application/church/church-service';
import { Container } from '../../../util/container.service';
import { AddressList } from '../../schedule/address-list/address-list';
import { AddressesService } from '../../../application/addresses/addresses-service';
import { ToastService } from '../../common/toast/toast.service';
import { Address } from '../../../domain/addresses';
import { AddressDescriptionPipe } from '../../../pipes/address-description.pipe';

@Component({
  selector: 'app-church-data',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, CardComponent, AddressDescriptionPipe],
  templateUrl: './church-data.html',
  styleUrl: './church-data.scss',
})
export class ChurchData implements OnInit {
  @Input({ required: true }) form!: FormGroup;

  private readonly churchService = inject(ChurchService);
  private readonly churchStore = inject(ChurchStore);
  private readonly container = inject(Container);
  private readonly addressesService = inject(AddressesService);
  private readonly toastService = inject(ToastService);

  protected readonly currentAddress = this.churchStore.getAddress();
  protected readonly churchTypes = this.churchStore.getChurchTypes();

  ngOnInit(): void {
    this.listChurchType();
  }

  private listChurchType() {
    if (this.churchTypes().length) {
      if (!this.form.controls['type_id'].value) {
        this.form.patchValue({ type_id: this.churchTypes()[0]?.value });
      }

      return;
    }

    this.churchService
      .listChurchType()
      .pipe(map((types) => types.map((t) => ({ value: t.id, label: t.name }))))
      .subscribe((types) => {
        this.churchStore.setChurchTypes(types);

        if (!this.form.controls['type_id'].value) {
          this.form.patchValue({ type_id: types[0]?.value });
        }
      });
  }

  protected openAddress(): void {
    const listRef = this.container.vcr?.createComponent(AddressList);
    listRef?.instance.addressSelected.subscribe((address) => {
      this.onAddressSelected(address);
    });
  }

  private onAddressSelected(address: Address): void {
    this.churchStore.setAddress(address);
    this.churchStore.patchChurchAddress(address);

    if (address.id !== 'pending') {
      this.addressesService.setAddressAsMain(address).subscribe(() => {
        this.toastService.openToast({
          success: true,
          message: 'Endereço da igreja atualizado com sucesso',
        });
      });
    }
  }
}
