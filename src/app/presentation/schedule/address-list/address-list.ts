import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AddressesStore } from '../../../application/addresses/addresses-store';
import { Address } from '../../../domain/addresses';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { AlertService } from '../../common/alert/alert.service';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [ModalComponent, InputComponent, CardComponent, PredictionsComponent, SkeletonComponent],
  templateUrl: './address-list.html',
  styleUrl: './address-list.scss',
})
export class AddressList implements OnInit {
  @ViewChild(InputComponent) private readonly searchInput!: InputComponent;

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly alertService = inject(AlertService);
  public readonly addressesStore = inject(AddressesStore);

  public searchAddress = '';
  public predictions: string[] = [];

  ngOnInit() {
    this.addressesStore.loadAddresses();
  }

  public get shouldShowRegisteredAddresses(): boolean {
    return this.searchAddress.trim().length === 0;
  }

  public onSearchAddress(value: string): void {
    this.searchAddress = value;

    if (!this.searchAddress.length) {
      this.predictions = [];
      return;
    }

    this.googleMapsService.getPlacePredictions(this.searchAddress).subscribe((predictions) => {
      this.predictions = predictions;
    });
  }

  public getAddressDescription(address: Address): string {
    return `${address.street}, ${address.district}, ${address.city} - ${address.state}`;
  }

  public getCardActions(address: Address): CardIconAction[] {
    return [
      {
        name: 'edit',
        ariaLabel: 'Editar endereço',
        action: () => this.handleEditAddress(address),
      },
      {
        name: 'delete_outline',
        ariaLabel: 'Excluir endereço',
        action: () => this.handleDeleteAddress(address),
      },
    ];
  }

  public onAddressCreated(): void {
    this.predictions = [];
    this.searchAddress = '';
    this.searchInput?.reset();
  }

  private handleEditAddress(address: Address): void {
    console.log('Editar endereço', address);
  }

  private async handleDeleteAddress(address: Address): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o endereço?',
    });

    if (!confirmed) return;

    this.addressesStore.deleteAddress(address.id).subscribe();
  }
}
