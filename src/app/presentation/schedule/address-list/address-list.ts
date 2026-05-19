import { Component, inject, NgZone, OnInit, output, ViewChild } from '@angular/core';
import { AddressesStore } from '../../../application/addresses/addresses-store';
import { Address } from '../../../domain/addresses';
import { GeocodedAddress } from '../../../domain/google-maps';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';
import { Container } from '../../../util/container.service';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { SkeletonComponent } from '../../common/skeleton/skeleton.component';
import { MapComponent } from '../../common/map/map.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { AlertService } from '../../common/alert/alert.service';
import { AddEventModal } from '../add-event-modal/add-event-modal';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [ModalComponent, InputComponent, CardComponent, PredictionsComponent, SkeletonComponent],
  templateUrl: './address-list.html',
  styleUrl: './address-list.scss',
})
export class AddressList implements OnInit {
  @ViewChild(InputComponent) private readonly searchInput!: InputComponent;
  @ViewChild(ModalComponent) private readonly modal!: ModalComponent;

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly alertService = inject(AlertService);
  private readonly container = inject(Container);
  private readonly ngZone = inject(NgZone);
  public readonly addressesStore = inject(AddressesStore);

  public readonly eventCreated = output<void>();

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

  public onSelectAddress(address: Address): void {
    this.modal.closeModal();
    const eventModal = this.container.vcr?.createComponent(AddEventModal);
    eventModal?.setInput('address', address);
    eventModal?.instance.eventCreated.subscribe(() => this.eventCreated.emit());
  }

  public onAddressCreated(): void {
    this.predictions = [];
    this.searchAddress = '';
    this.searchInput?.reset();
  }

  private handleEditAddress(address: Address): void {
    const geocodedAddress: GeocodedAddress = {
      lat: parseFloat(address.latitude),
      lng: parseFloat(address.longitude),
      street: address.street,
      number: address.number,
      district: address.district,
      city: address.city,
      state: address.state,
      cep: address.cep,
    };

    const mapRef = this.container.vcr?.createComponent(MapComponent);
    if (!mapRef) return;

    mapRef.setInput('geocodedAddress', geocodedAddress);
    mapRef.setInput('existingAddress', address);

    mapRef.instance.confirmed.subscribe(() => {
      this.ngZone.run(() => {});
    });
  }

  private async handleDeleteAddress(address: Address): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o endereço?',
    });

    if (!confirmed) return;

    this.addressesStore.deleteAddress(address.id).subscribe();
  }
}
