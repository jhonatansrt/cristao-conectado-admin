import { Observable } from 'rxjs';
import { Address } from './entities/address.entity';
import { GetAddressesDTO } from './dto/get-addresses.dto';

export abstract class IAddressesRepository {
  abstract getAddresses(props: GetAddressesDTO): Observable<Address[]>;
}
