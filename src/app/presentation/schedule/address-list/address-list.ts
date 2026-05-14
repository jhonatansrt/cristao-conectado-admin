import { Component } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { InputComponent } from '../../common/input/input';
import { CardComponent, CardIconAction } from '../../common/card/card.component';

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
