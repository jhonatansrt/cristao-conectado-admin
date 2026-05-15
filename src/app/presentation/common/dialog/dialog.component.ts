import { Component, ElementRef, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog',
  imports: [MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: true,
})
export class DialogComponent {
  public readonly title = input('');
  public readonly close = output<void>();

  constructor(private readonly el: ElementRef) {}

  public onClose(): void {
    this.close.emit();
  }

  public closeDialog(): void {
    const selector = this.el.nativeElement.parentElement.tagName.toLowerCase();

    setTimeout(() => {
      document.querySelector(selector + ':nth-last-of-type(1)')?.remove();
    }, 0);
  }
}
