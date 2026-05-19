import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Address } from '../../domain/addresses';
import { GeocodedAddress } from '../../domain/google-maps';
import { AddressesService } from './addresses-service';

@Injectable({
  providedIn: 'root',
})
export class AddressesStore {
  private readonly addressesService = inject(AddressesService);

  public readonly addresses = signal<Address[]>([]);
  public readonly isLoading = signal(false);

  public loadAddresses(): void {
    this.isLoading.set(true);
    this.addressesService.getAddresses().subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  public createAddress(geocoded: GeocodedAddress, place: string): Observable<Address> {
    return this.addressesService.createAddress(geocoded, place).pipe(
      tap((address) => {
        this.addresses.update((list) => [...list, address]);
      }),
    );
  }
}
