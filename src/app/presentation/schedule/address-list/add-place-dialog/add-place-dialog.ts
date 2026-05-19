import { Component, ElementRef, inject, input, output } from '@angular/core';
import { AddressesStore } from '../../../../application/addresses/addresses-store';
import { GeocodedAddress } from '../../../../domain/google-maps';
import { ButtonComponent } from '../../../common/button/button.component';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { InputComponent } from '../../../common/input/input';

@Component({
  selector: 'app-add-place-dialog',
  standalone: true,
  imports: [DialogComponent, InputComponent, ButtonComponent],
  templateUrl: './add-place-dialog.html',
  styleUrl: './add-place-dialog.scss',
})
export class AddPlaceDialog {
  public readonly geocodedAddress = input.required<GeocodedAddress>();
  public readonly close = output<void>();

  private readonly el = inject(ElementRef);
  private readonly addressesStore = inject(AddressesStore);

  public place = '';

  public onValueChange(value: string): void {
    this.place = value;
  }

  public onConfirm(): void {
    if (!this.place.trim()) return;
    this.addressesStore.createAddress(this.geocodedAddress(), this.place.trim()).subscribe({
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
