import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { timeMask } from './time.mask';

@Directive({
  selector: '[appTimeMask]',
})
export class TimeMaskDirective {
  public readonly appTimeMask = input<boolean>(true);

  public constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  public onInput(): void {
    if (!this.appTimeMask()) {
      return;
    }

    const inputElement = this.elementRef.nativeElement;
    inputElement.value = timeMask(inputElement.value);
  }
}
