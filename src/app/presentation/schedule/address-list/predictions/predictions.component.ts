import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsService } from '../../../../application/google-maps/google-maps-service';
import { Container } from '../../../../util/container.service';
import { MapComponent } from '../../../common/map/map.component';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PredictionsComponent {
  public readonly predictions = input.required<string[]>();

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly container = inject(Container);

  public getPredictionTitle(prediction: string): string {
    return prediction.split(',')[0]?.trim() ?? prediction;
  }

  public getPredictionSubtitle(prediction: string): string {
    const parts = prediction.split(',');
    return parts.slice(1).join(',').trim();
  }

  public onPredictionClick(prediction: string): void {
    this.googleMapsService.geocodeAddress(prediction).subscribe((coords) => {
      if (!coords) return;

      const mapRef = this.container.vcr?.createComponent(MapComponent);
      if (!mapRef) return;

      mapRef.setInput('coordinates', coords);
    });
  }
}
