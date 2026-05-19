import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeocodedAddress, GoogleMapRef, IGoogleMapsRepository } from '../../domain/google-maps';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private readonly googleMapsRepository = inject(IGoogleMapsRepository);

  public getPlacePredictions(input: string, country = 'br'): Observable<string[]> {
    if (!input.trim()) {
      return of([]);
    }

    return this.googleMapsRepository.getPlacePredictions({ input, country });
  }

  public initMap(container: HTMLElement, coords: { lat: number; lng: number }): GoogleMapRef {
    return this.googleMapsRepository.initMap(container, coords);
  }

  public geocodeAddress(address: string): Observable<GeocodedAddress | null> {
    return this.googleMapsRepository.geocodeAddress(address);
  }
}
