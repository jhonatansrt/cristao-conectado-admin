import { Injectable, signal } from '@angular/core';
import { Address } from '../../domain/addresses';

@Injectable({
  providedIn: 'root',
})
export class AddressesStore {
  public readonly addresses = signal<Address[]>([]);
  public readonly isLoading = signal(false);

  public setAddresses(addresses: Address[]): void {
    this.addresses.set(addresses);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }
}
