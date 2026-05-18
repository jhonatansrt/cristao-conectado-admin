import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { InputComponent } from '../../common/input/input';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';

interface AddressItem {
  title: string;
  description: string;
}

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [ModalComponent, InputComponent, CardComponent],
  templateUrl: './address-list.html',
  styleUrl: './address-list.scss',
})
export class AddressList {
  private readonly googleMapsService = inject(GoogleMapsService);

  public searchAddress = '';
  public predictions: string[] = [];

  private readonly handleEditAddress = (address: AddressItem): void => {
    console.log('Editar endereço', address);
  };

  private readonly handleDeleteAddress = (address: AddressItem): void => {
    console.log('Excluir endereço', address);
  };

  public readonly addresses: AddressItem[] = [
    { title: 'PIB', description: 'Icui-guajará, Ananindeua - PA' },
    { title: 'PIB', description: 'Icui-guajará, Ananindeua - PA' },
    { title: 'PIB', description: 'Icui-guajará, Ananindeua - PA' },
  ];

  public get shouldShowRegisteredAddresses(): boolean {
    return this.searchAddress.trim().length === 0;
  }

  public onSearchAddress(value: string): void {
    this.searchAddress = value;

    this.googleMapsService.getPlacePredictions(this.searchAddress).subscribe((predictions) => {
      this.predictions = predictions;
    });
  }

  public getCardActions(address: AddressItem): CardIconAction[] {
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
}
