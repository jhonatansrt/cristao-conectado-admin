import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [IonIcon],
})
export class ToastComponent {
  @Input() success: boolean = true;
  @Input() title: string | undefined;
  @Input() message: string | undefined;

  constructor(public toastService: ToastService) {
    addIcons({ closeOutline, checkmarkCircleOutline, alertCircleOutline });
  }
}
