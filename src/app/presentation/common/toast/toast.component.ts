import { Component, Input } from '@angular/core';
import { ToastService } from './toast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [MatIconModule],
})
export class ToastComponent {
  @Input() success: boolean = true;
  @Input() title: string | undefined;
  @Input() message: string | undefined;

  constructor(public toastService: ToastService) {}
}
