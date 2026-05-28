import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { Address, IAddressesRepository } from '../../domain/addresses';
import { GeocodedAddress } from '../../domain/google-maps';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { AddressesStore } from './addresses-store';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private addressesRepository = inject(IAddressesRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private addressesStore = inject(AddressesStore);

  public getAddresses(): Observable<Address[]> {
    return this.addressesRepository.getAddresses().pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public loadAddresses(): void {
    this.addressesStore.setIsLoading(true);
    this.getAddresses().subscribe({
      next: (addresses) => {
        this.addressesStore.setAddresses(addresses);
        this.addressesStore.setIsLoading(false);
      },
      error: () => {
        this.addressesStore.setIsLoading(false);
      },
    });
  }

  public createAddress(geocoded: GeocodedAddress, place: string): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      this.addressesStore.setPendingAddress({ geocoded, place });
      return of(void 0);
    }

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
      isMain: true,
    }).pipe(
      switchMap(() => this.getAddresses()),
      tap((addresses) => this.addressesStore.setAddresses(addresses)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateAddress(address: Address, place: string, number: string): Observable<void> {
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
      switchMap(() => this.getAddresses()),
      tap((addresses) => this.addressesStore.setAddresses(addresses)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteAddress(id: string): Observable<void> {
    return this.addressesRepository.deleteAddress(id).pipe(
      switchMap(() => this.getAddresses()),
      tap((addresses) => this.addressesStore.setAddresses(addresses)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
