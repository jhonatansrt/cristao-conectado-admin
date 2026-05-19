import { Observable } from 'rxjs';
import { GeocodedAddress } from './geocoded-address';
import { GetPlacePredictionsDTO } from './dto/get-place-predictions.dto';
import { GoogleMapRef } from './google-map-ref';

export abstract class IGoogleMapsRepository {
  abstract getPlacePredictions(props: GetPlacePredictionsDTO): Observable<string[]>;
  abstract initMap(container: HTMLElement, coords: { lat: number; lng: number }): GoogleMapRef;
  abstract geocodeAddress(address: string): Observable<GeocodedAddress | null>;
}
