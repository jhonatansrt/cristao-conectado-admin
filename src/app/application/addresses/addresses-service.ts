import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { IAddressesRepository } from '../../domain/addresses';
import { Address } from '../../domain/addresses';

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
}
