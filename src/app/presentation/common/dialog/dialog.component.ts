import { Component, input, output } from '@angular/core';
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

  public onClose(): void {
    this.close.emit();
  }
}
