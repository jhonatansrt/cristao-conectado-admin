import { AfterViewInit, Component, ElementRef, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';
import { GoogleMapRef } from '../../../domain/google-maps';
import { Container } from '../../../util/container.service';
import { AddPlaceDialog } from '../../schedule/address-list/add-place-dialog/add-place-dialog';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [DialogComponent, ButtonComponent, MatIconModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  public readonly coordinates = input.required<{ lat: number; lng: number }>();
  public readonly close = output<void>();
  public readonly confirm = output<{ place: string; coordinates: { lat: number; lng: number } }>();

  @ViewChild('mapContainer') private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private mapRef: GoogleMapRef | null = null;

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly container = inject(Container);
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    this.mapRef = this.googleMapsService.initMap(this.mapContainer.nativeElement, this.coordinates());
  }

  ngOnDestroy(): void {
    this.mapRef = null;
  }

  public onClose(): void {
    this.close.emit();
    this.el.nativeElement.remove();
  }

  public onConfirm(): void {
    if (!this.mapRef) return;

    const confirmedCoords = this.mapRef.getCenter();
    const dialogRef = this.container.vcr?.createComponent(AddPlaceDialog);
    if (!dialogRef) return;

    dialogRef.setInput('coordinates', confirmedCoords);

    dialogRef.instance.confirm.subscribe((result) => {
      this.confirm.emit(result);
      this.el.nativeElement.remove();
    });

    dialogRef.instance.close.subscribe(() => {
      this.el.nativeElement.remove();
    });
  }
}
