import { Injectable, signal } from '@angular/core';
import { Address } from '../../domain/addresses';

@Injectable({
  providedIn: 'root',
})
export class AddressesStore {
  private readonly addresses = signal<Address[]>([]);
  private readonly isLoading = signal(false);

  public setAddresses(addresses: Address[]): void {
    this.addresses.set(addresses);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public getAddresses(): Address[] {
    return this.addresses();
  }

  public getIsLoading(): boolean {
    return this.isLoading();
  }
}
