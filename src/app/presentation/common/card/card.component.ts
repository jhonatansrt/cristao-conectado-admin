import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface CardIconAction {
  name: string;
  action: () => void;
  ariaLabel?: string;
}

@Component({
  selector: 'app-card',
  imports: [MatIconModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  standalone: true,
})
export class CardComponent {
  public readonly title = input.required<string>();
  public readonly description = input.required<string | null>();
  public readonly icons = input<CardIconAction[]>([]);
  public readonly borderRadius = input<string>('8px');
  public readonly clickable = input<boolean>(false);
}
