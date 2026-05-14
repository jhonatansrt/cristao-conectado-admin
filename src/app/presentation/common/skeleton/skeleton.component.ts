import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
  @Input() public width: string = '100%';
  @Input() public height: string = '16px';
  @Input() public borderRadius: string = '8px';
  @Input() public opacity: string = '1';
}
