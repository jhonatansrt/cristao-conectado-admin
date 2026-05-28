import { Component, computed, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AddressesStore } from '../../../application/addresses/addresses-store';
import { AddressesService } from '../../../application/addresses/addresses-service';
import { SchedulesStore } from '../../../application/schedules/schedules-store';
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
import { ChurchStore } from '../../../application/church/church-store';

interface AddressCard extends Address {
  actions: CardIconAction[];
}

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
  @Input() public isChurch: boolean = false;

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly alertService = inject(AlertService);
  private readonly container = inject(Container);
  public readonly addressesStore = inject(AddressesStore);
  private readonly addressesService = inject(AddressesService);
  private readonly schedulesStore = inject(SchedulesStore);
  private readonly churchStore = inject(ChurchStore);

  public searchAddress = '';
  public predictions: string[] = [];

  public readonly addresses = computed<AddressCard[]>(() =>
    this.addressesStore
      .getAddresses()()
      .map((address) => ({
        ...address,
        actions: [
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
        ],
      })),
  );

  ngOnInit(): void {
    this.addressesService.loadAddresses();
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

  public onSelectAddress(address: Address): void {
    this.modal.closeModal();

    if (this.isChurch) {
      if (address.id !== 'pending') {
        this.addressesService.setAddressAsMain(address).subscribe();
      }

      this.churchStore.setAddress(address);
      this.churchStore.patchChurchAddress(address);
    } else {
      const eventModal = this.container.vcr?.createComponent(AddEventModal);
      eventModal?.setInput('address', address);
    }
  }

  public onAddressCreated(): void {
    this.predictions = [];
    this.searchAddress = '';
    this.searchInput?.reset();

    if (this.isChurch) {
      const pending = this.addressesStore.getPendingAddress()();
      if (pending) {
        const mockAddress: Address = {
          id: 'pending',
          place: pending.place,
          cep: pending.geocoded.cep,
          number: pending.geocoded.number,
          street: pending.geocoded.street,
          district: pending.geocoded.district,
          city: pending.geocoded.city,
          state: pending.geocoded.state,
          latitude: String(pending.geocoded.lat),
          longitude: String(pending.geocoded.lng),
        };
        this.onSelectAddress(mockAddress);
      }
    }
  }

  private getModelGeocodedAddress(address: Address): GeocodedAddress {
    return {
      lat: parseFloat(address.latitude),
      lng: parseFloat(address.longitude),
      street: address.street,
      number: address.number,
      district: address.district,
      city: address.city,
      state: address.state,
      cep: address.cep,
    };
  }

  private handleEditAddress(address: Address): void {
    const mapRef = this.container.vcr?.createComponent(MapComponent);
    mapRef?.setInput('geocodedAddress', this.getModelGeocodedAddress(address));
    mapRef?.setInput('existingAddress', address);
  }

  private async handleDeleteAddress(address: Address): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o endereço?',
    });

    if (confirmed) {
      this.addressesService.deleteAddress(address.id).subscribe();
    }
  }
}
