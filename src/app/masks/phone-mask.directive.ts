import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { phoneMask } from './phone.mask';

@Directive({
  selector: '[appPhoneMask]',
})
export class PhoneMaskDirective {
  public readonly appPhoneMask = input<boolean>(true);

  public constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  public onInput(): void {
    if (!this.appPhoneMask()) return;

    const el = this.elementRef.nativeElement;
    el.value = phoneMask(el.value);
  }
}
