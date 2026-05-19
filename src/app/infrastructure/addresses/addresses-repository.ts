import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, IAddressesRepository } from '../../domain/addresses';
import { GetAddressesDTO } from '../../domain/addresses/dto/get-addresses.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesRepository implements IAddressesRepository {
  constructor(private httpClient: HttpClient) {}

  public getAddresses(props: GetAddressesDTO): Observable<Address[]> {
    const url = environment.apiBaseURL + '/adresses';
    const params = new HttpParams({
      fromObject: {
        church_id: props.churchId,
      },
    });

    return this.httpClient.get<Address[]>(url, { params });
  }
}
