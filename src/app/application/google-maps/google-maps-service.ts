import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IGoogleMapsRepository } from '../../domain/google-maps';

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
}
