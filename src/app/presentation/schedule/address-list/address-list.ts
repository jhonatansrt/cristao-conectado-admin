import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { InputComponent } from '../../common/input/input';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';
import { AddressesService } from '../../../application/addresses/addresses-service';
import { Address } from '../../../domain/addresses';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [ModalComponent, InputComponent, CardComponent, PredictionsComponent, SkeletonComponent],
  templateUrl: './address-list.html',
  styleUrl: './address-list.scss',
})
export class AddressList implements OnInit {
  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly addressesService = inject(AddressesService);

  public addresses: Address[] = [];
  public searchAddress = '';
  public predictions: string[] = [];
  public isLoading = false;

  ngOnInit() {
    this.getAddresses();
  }

  private getAddresses() {
    this.isLoading = true;
    this.addressesService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  public get shouldShowRegisteredAddresses(): boolean {
    return this.searchAddress.trim().length === 0;
  }

  public onSearchAddress(value: string): void {
    this.searchAddress = value;

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

  private handleEditAddress(address: Address): void {
    console.log('Editar endereço', address);
  }

  private handleDeleteAddress(address: Address): void {
    console.log('Excluir endereço', address);
  }
}
