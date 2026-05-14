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
  public readonly description = input.required<string>();
  public readonly icons = input<CardIconAction[]>([]);
}
