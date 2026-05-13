import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [MatIconModule, ButtonComponent],
})
export class AlertComponent {
  @Input() message = 'Tem certeza que deseja continuar?';

  @Output() public response = new EventEmitter<boolean>();

  public answer(confirmed: boolean) {
    this.response.emit(confirmed);

    document.querySelector('app-alert')?.remove();
  }
}
