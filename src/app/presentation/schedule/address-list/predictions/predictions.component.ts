import { Component, input } from '@angular/core';
import { CardComponent } from '../../../common/card/card.component';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.scss',
})
export class PredictionsComponent {
  public readonly predictions = input.required<string[]>();
}
