import { Injectable, Signal, signal } from '@angular/core';
import { Address } from '../../domain/addresses';
import { GeocodedAddress } from '../../domain/google-maps';

export type PendingAddress = { geocoded: GeocodedAddress; place: string };

@Injectable({
  providedIn: 'root',
})
export class AddressesStore {
  private readonly addresses = signal<Address[]>([]);
  private readonly isLoading = signal(false);
  private readonly pendingAddress = signal<PendingAddress | null>(null);

  public setAddresses(addresses: Address[]): void {
    this.addresses.set(addresses);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public setPendingAddress(pending: PendingAddress | null): void {
    this.pendingAddress.set(pending);
  }

  public getAddresses(): Signal<Address[]> {
    return this.addresses;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public getPendingAddress(): Signal<PendingAddress | null> {
    return this.pendingAddress;
  }
}
