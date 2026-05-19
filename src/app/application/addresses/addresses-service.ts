import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { Address, IAddressesRepository } from '../../domain/addresses';
import { GeocodedAddress } from '../../domain/google-maps';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private addressesRepository = inject(IAddressesRepository);
  private authStore = inject(AuthStore);

  public getAddresses(): Observable<Address[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.addressesRepository.getAddresses({ churchId });
  }

  public createAddress(geocoded: GeocodedAddress, place: string): Observable<Address> {
    const churchId = this.authStore.getUserLogged()()?.church_id ?? '';
    return this.addressesRepository.createAddress({
      cep: geocoded.cep,
      number: geocoded.number,
      street: geocoded.street,
      district: geocoded.district,
      city: geocoded.city,
      state: geocoded.state,
      latitude: geocoded.lat,
      longitude: geocoded.lng,
      place,
      churchId,
    });
  }
}
