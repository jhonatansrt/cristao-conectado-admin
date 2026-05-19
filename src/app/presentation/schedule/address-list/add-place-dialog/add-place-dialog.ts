import { Component, ElementRef, inject, input, output } from '@angular/core';
import { DialogComponent } from '../../../common/dialog/dialog.component';
import { InputComponent } from '../../../common/input/input';
import { ButtonComponent } from '../../../common/button/button.component';

@Component({
  selector: 'app-add-place-dialog',
  standalone: true,
  imports: [DialogComponent, InputComponent, ButtonComponent],
  templateUrl: './add-place-dialog.html',
  styleUrl: './add-place-dialog.scss',
})
export class AddPlaceDialog {
  public readonly coordinates = input.required<{ lat: number; lng: number }>();
  public readonly confirm = output<{ place: string; coordinates: { lat: number; lng: number } }>();
  public readonly close = output<void>();

  private readonly el = inject(ElementRef);

  public place = '';

  public onValueChange(value: string): void {
    this.place = value;
  }

  public onConfirm(): void {
    if (!this.place.trim()) return;
    this.confirm.emit({ place: this.place.trim(), coordinates: this.coordinates() });
    this.el.nativeElement.remove();
  }

  public onClose(): void {
    this.close.emit();
    this.el.nativeElement.remove();
  }
}
