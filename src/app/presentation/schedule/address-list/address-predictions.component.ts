import { Component, input } from '@angular/core';
import { CardComponent } from '../../common/card/card.component';

@Component({
  selector: 'app-address-predictions',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './address-predictions.component.html',
})
export class AddressPredictionsComponent {
  public readonly predictions = input.required<string[]>();
}
