import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GetPlacePredictionsDTO, IGoogleMapsRepository } from '../../domain/google-maps';

type GoogleMapsAutocompleteService = {
  getPlacePredictions: (
    request: { input: string; componentRestrictions?: { country: string } },
    callback: (predictions: { description: string }[] | null, status: string) => void,
  ) => void;
};

@Injectable()
export class GoogleMapsRepository implements IGoogleMapsRepository {
  private readonly googleApi = (window as Window & {
    google?: {
      maps?: {
        places?: {
          AutocompleteService?: new () => GoogleMapsAutocompleteService;
          PlacesServiceStatus?: { OK: string };
        };
      };
    };
  }).google;

  private readonly autocompleteService = this.googleApi?.maps?.places
    ?.AutocompleteService
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
          if (status !== this.googleApi?.maps?.places?.PlacesServiceStatus?.OK || !predictions?.length) {
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
}
