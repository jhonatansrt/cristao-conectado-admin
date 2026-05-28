import { Observable } from 'rxjs';
import { Address } from './entities/address.entity';
import { CreateAddressDTO } from './dto/create-address.dto';
import { GetAddressesDTO } from './dto/get-addresses.dto';

export abstract class IAddressesRepository {
  abstract getAddresses(dto: GetAddressesDTO): Observable<Address[]>;
  abstract createAddress(props: CreateAddressDTO): Observable<Address>;
  abstract updateAddress(id: string, props: CreateAddressDTO): Observable<Address>;
  abstract deleteAddress(id: string): Observable<void>;
}
