import { AfterViewInit, Component, ElementRef, input, OnDestroy, output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from '../dialog/dialog.component';

type GoogleMapInstance = {
  getCenter: () => { lat: () => number; lng: () => number };
  setCenter: (location: unknown) => void;
};

type GoogleGeocodeResult = {
  geometry: { location: unknown };
};

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [DialogComponent, ButtonComponent, MatIconModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  public readonly prediction = input.required<string>();
  public readonly close = output<void>();
  public readonly confirm = output<{ lat: number; lng: number }>();

  @ViewChild('mapContainer') private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private map: GoogleMapInstance | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly googleApi = (window as any).google;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map = null;
  }

  private initMap(): void {
    if (!this.googleApi?.maps) return;

    this.map = new this.googleApi.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    }) as GoogleMapInstance;

    this.geocodePrediction();
  }

  private geocodePrediction(): void {
    if (!this.googleApi?.maps?.Geocoder || !this.map) return;

    const geocoder = new this.googleApi.maps.Geocoder();
    geocoder.geocode(
      { address: this.prediction() },
      (results: GoogleGeocodeResult[], status: string) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          this.map?.setCenter(results[0].geometry.location);
        }
      },
    );
  }

  public onClose(): void {
    this.close.emit();
  }

  public onConfirm(): void {
    if (!this.map) return;
    const center = this.map.getCenter();
    this.confirm.emit({ lat: center.lat(), lng: center.lng() });
  }
}
