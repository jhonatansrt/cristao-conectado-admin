import { Component, ElementRef, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AddressesService } from '../../../../application/addresses/addresses-service';
import { Address } from '../../../../domain/addresses';
import { GeocodedAddress } from '../../../../domain/google-maps';
import { ButtonComponent } from '../../../common/button/button.component';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { InputComponent } from '../../../common/input/input';

@Component({
  selector: 'app-add-place-dialog',
  standalone: true,
  imports: [DialogComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-place-dialog.html',
  styleUrl: './add-place-dialog.scss',
})
export class AddPlaceDialog implements OnInit {
  public readonly geocodedAddress = input<GeocodedAddress | null>(null);
  public readonly existingAddress = input<Address | null>(null);
  public readonly close = output<void>();

  private readonly el = inject(ElementRef);
  private readonly fb = inject(FormBuilder);
  private readonly addressesService = inject(AddressesService);

  public loading = false;

  public readonly form = this.fb.group({
    place: ['', Validators.required],
    number: ['', Validators.required],
  });

  public get isEditMode(): boolean {
    return !!this.existingAddress();
  }

  ngOnInit(): void {
    const existing = this.existingAddress();
    if (existing) {
      this.form.patchValue({ place: existing.place, number: existing.number });
    }
  }

  public onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { place, number } = this.form.getRawValue();
    this.loading = true;

    const existing = this.existingAddress();
    if (existing) {
      const geocoded = this.geocodedAddress();
      const addressToUpdate = geocoded
        ? { ...existing, latitude: String(geocoded.lat), longitude: String(geocoded.lng) }
        : existing;

      this.addressesService
        .updateAddress(addressToUpdate, place!.trim(), number!.trim())
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.close.emit();
            this.el.nativeElement.remove();
          },
          error: () => {},
        });
      return;
    }

    const geocoded = this.geocodedAddress();
    if (!geocoded) return;

    const addressWithNumber = { ...geocoded, number: number!.trim() };
    this.addressesService
      .createAddress(addressWithNumber, place!.trim())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.close.emit();
          this.el.nativeElement.remove();
        },
        error: () => {},
      });
  }

  public onClose(): void {
    this.close.emit();
    this.el.nativeElement.remove();
  }
}
