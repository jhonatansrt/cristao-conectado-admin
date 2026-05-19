import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GetPlacePredictionsDTO, GoogleMapRef, IGoogleMapsRepository } from '../../domain/google-maps';

type AutocompleteService = {
  getPlacePredictions: (
    request: { input: string; componentRestrictions?: { country: string } },
    callback: (predictions: { description: string }[] | null, status: string) => void,
  ) => void;
};

type GeocodeResult = {
  geometry: { location: { lat: () => number; lng: () => number } };
};

type GeocoderService = {
  geocode: (
    request: { address: string },
    callback: (results: GeocodeResult[] | null, status: string) => void,
  ) => void;
};

type GoogleMapsApi = {
  maps?: {
    Map?: new (container: HTMLElement, options: object) => {
      getCenter: () => { lat: () => number; lng: () => number };
    };
    Geocoder?: new () => GeocoderService;
    places?: {
      AutocompleteService?: new () => AutocompleteService;
      PlacesServiceStatus?: { OK: string };
    };
  };
};

@Injectable()
export class GoogleMapsRepository implements IGoogleMapsRepository {
  private readonly googleApi = (window as Window & { google?: GoogleMapsApi }).google;

  private readonly autocompleteService = this.googleApi?.maps?.places?.AutocompleteService
    ? new this.googleApi.maps.places.AutocompleteService()
    : null;

  public getPlacePredictions(props: GetPlacePredictionsDTO): Observable<string[]> {
    if (!this.autocompleteService) {
      return of([]);
    }

    return new Observable<string[]>((observer) => {
      this.autocompleteService?.getPlacePredictions(
        {
          input: props.input,
          componentRestrictions: props.country ? { country: props.country } : undefined,
        },
        (predictions, status) => {
          if (
            status !== this.googleApi?.maps?.places?.PlacesServiceStatus?.OK ||
            !predictions?.length
          ) {
            observer.next([]);
            observer.complete();
            return;
          }

          observer.next(predictions.map((prediction) => prediction.description));
          observer.complete();
        },
      );
    });
  }

  public initMap(container: HTMLElement, coords: { lat: number; lng: number }): GoogleMapRef {
    const mapInstance = new this.googleApi!.maps!.Map!(container, {
      center: coords,
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });

    return {
      getCenter: () => {
        const center = mapInstance.getCenter();
        return { lat: center.lat(), lng: center.lng() };
      },
    };
  }

  public geocodeAddress(address: string): Observable<{ lat: number; lng: number } | null> {
    if (!this.googleApi?.maps?.Geocoder) {
      return of(null);
    }

    return new Observable((observer) => {
      const geocoder = new this.googleApi!.maps!.Geocoder!();

      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          observer.next({ lat: location.lat(), lng: location.lng() });
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    });
  }
}
