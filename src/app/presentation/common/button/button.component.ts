import { Component, Input } from '@angular/core';
import { IonSpinner } from '@ionic/angular/standalone';
import { ButtonClass } from './button.data';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [IonSpinner],
})
export class ButtonComponent {
  @Input() public disabled?: boolean;
  @Input() public loading?: boolean;
  @Input() public btnClass?: ButtonClass;
}
