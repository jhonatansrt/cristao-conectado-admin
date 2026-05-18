import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.scss',
})
export class PredictionsComponent {
  public readonly predictions = input.required<string[]>();

  public getPredictionTitle(prediction: string): string {
    return prediction.split(',')[0]?.trim() ?? prediction;
  }

  public getPredictionSubtitle(prediction: string): string {
    const parts = prediction.split(',');
    return parts.slice(1).join(',').trim();
  }
}
