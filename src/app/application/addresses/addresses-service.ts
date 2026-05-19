import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { Address, IAddressesRepository } from '../../domain/addresses';
import { GeocodedAddress } from '../../domain/google-maps';
import { ToastService } from '../../presentation/common/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private addressesRepository = inject(IAddressesRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);

  public getAddresses(): Observable<Address[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.addressesRepository.getAddresses({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
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
    }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateAddress(address: Address, place: string, number: string): Observable<Address> {
    const churchId = this.authStore.getUserLogged()()?.church_id ?? '';
    return this.addressesRepository.updateAddress(address.id, {
      cep: address.cep,
      number,
      street: address.street,
      district: address.district,
      city: address.city,
      state: address.state,
      latitude: parseFloat(address.latitude),
      longitude: parseFloat(address.longitude),
      place,
      churchId,
    }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteAddress(id: string): Observable<void> {
    return this.addressesRepository.deleteAddress(id).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
