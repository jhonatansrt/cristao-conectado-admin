import { Pipe, PipeTransform } from '@angular/core';

import { Address } from '../domain/addresses';

@Pipe({
  name: 'addressDescription',
  standalone: true,
})
export class AddressDescriptionPipe implements PipeTransform {
  public transform(address: Address | null | undefined): string {
    if (!address) return '';
    return `${address.street}, ${address.district}, ${address.city} - ${address.state}`;
  }
}
