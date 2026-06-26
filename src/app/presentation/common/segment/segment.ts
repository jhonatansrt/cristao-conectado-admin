import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface SegmentOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-segment',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './segment.html',
  styleUrl: './segment.scss',
})
export class SegmentComponent {
  public readonly options = input<SegmentOption[]>([]);
  public readonly selected = input<string>('');
  public readonly selectedChange = output<string>();

  public select(value: string): void {
    this.selectedChange.emit(value);
  }
}
