import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { dateOfBirthMask } from './date-of-birth.mask';

@Directive({
  selector: '[appDateOfBirthMask]',
})
export class DateOfBirthMaskDirective {
  public readonly appDateOfBirthMask = input<boolean>(true);

  public constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  public onInput(): void {
    if (!this.appDateOfBirthMask()) {
      return;
    }

    const inputElement = this.elementRef.nativeElement;
    inputElement.value = dateOfBirthMask(inputElement.value);
  }
}
