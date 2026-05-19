import { AfterViewInit, Component, ElementRef, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsService } from '../../../application/google-maps/google-maps-service';
import { Address } from '../../../domain/addresses';
import { GeocodedAddress, GoogleMapRef } from '../../../domain/google-maps';
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
  public readonly geocodedAddress = input.required<GeocodedAddress>();
  public readonly existingAddress = input<Address | null>(null);
  public readonly close = output<void>();
  public readonly confirmed = output<void>();

  @ViewChild('mapContainer') private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private mapRef: GoogleMapRef | null = null;

  private readonly googleMapsService = inject(GoogleMapsService);
  private readonly container = inject(Container);
  private readonly el = inject(ElementRef);

  ngAfterViewInit(): void {
    const { lat, lng } = this.geocodedAddress();
    this.mapRef = this.googleMapsService.initMap(this.mapContainer.nativeElement, { lat, lng });
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

    const center = this.mapRef.getCenter();
    const geocodedWithCenter: GeocodedAddress = { ...this.geocodedAddress(), ...center };

    const dialogRef = this.container.vcr?.createComponent(AddPlaceDialog);
    if (!dialogRef) return;

    dialogRef.setInput('geocodedAddress', geocodedWithCenter);

    const existing = this.existingAddress();
    if (existing) {
      dialogRef.setInput('existingAddress', existing);
    }

    dialogRef.instance.close.subscribe(() => {
      this.confirmed.emit();
      this.el.nativeElement.remove();
    });
  }
}
