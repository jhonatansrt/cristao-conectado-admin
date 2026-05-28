import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address, CreateAddressDTO, IAddressesRepository } from '../../domain/addresses';
import { GetAddressesDTO } from '../../domain/addresses/dto/get-addresses.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressesRepository implements IAddressesRepository {
  constructor(private httpClient: HttpClient) {}

  public getAddresses(dto: GetAddressesDTO): Observable<Address[]> {
    const url = environment.apiBaseURL + '/adresses';
    const params = new HttpParams({ fromObject: { church_id: dto.churchId } });
    return this.httpClient.get<Address[]>(url, { params });
  }

  public createAddress(props: CreateAddressDTO): Observable<Address> {
    const url = environment.apiBaseURL + '/adresses';
    const body = {
      cep: props.cep,
      number: props.number,
      street: props.street,
      district: props.district,
      city: props.city,
      state: props.state,
      latitude: props.latitude,
      longitude: props.longitude,
      place: props.place,
      church_id: props.churchId,
      is_main: props.isMain ?? false,
    };
    return this.httpClient.post<Address>(url, body);
  }

  public updateAddress(id: string, props: CreateAddressDTO): Observable<Address> {
    const url = `${environment.apiBaseURL}/adresses/${id}/`;
    const body = {
      cep: props.cep,
      number: props.number,
      street: props.street,
      district: props.district,
      city: props.city,
      state: props.state,
      latitude: props.latitude,
      longitude: props.longitude,
      place: props.place,
      church_id: props.churchId,
    };
    return this.httpClient.put<Address>(url, body);
  }

  public deleteAddress(id: string): Observable<void> {
    const url = `${environment.apiBaseURL}/adresses/${id}/`;
    return this.httpClient.delete<void>(url);
  }
}
