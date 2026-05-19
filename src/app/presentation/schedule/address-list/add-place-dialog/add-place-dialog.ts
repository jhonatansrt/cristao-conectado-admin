import { Component, ElementRef, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AddressesStore } from '../../../../application/addresses/addresses-store';
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
export class AddPlaceDialog {
  public readonly geocodedAddress = input.required<GeocodedAddress>();
  public readonly close = output<void>();

  private readonly el = inject(ElementRef);
  private readonly fb = inject(FormBuilder);
  private readonly addressesStore = inject(AddressesStore);

  public loading = false;

  public readonly form = this.fb.group({
    place: ['', Validators.required],
    number: ['', Validators.required],
  });

  public onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { place, number } = this.form.getRawValue();
    const geocoded = this.geocodedAddress();
    const addressWithNumber = { ...geocoded, number: number!.trim() };

    this.loading = true;
    this.addressesStore
      .createAddress(addressWithNumber, place!.trim())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.close.emit();
          this.el.nativeElement.remove();
        },
      });
  }

  public onClose(): void {
    this.close.emit();
    this.el.nativeElement.remove();
  }
}
