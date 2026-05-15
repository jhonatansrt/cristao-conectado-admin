import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-case',
  imports: [MatIconModule],
  templateUrl: './empty-case.component.html',
  styleUrl: './empty-case.component.scss',
  standalone: true,
})
export class EmptyCaseComponent {
  public readonly description = input.required<string>();
  public readonly icon = input('playlist_remove');
}
