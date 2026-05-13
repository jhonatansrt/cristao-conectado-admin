import { Injectable } from '@angular/core';
import { Container } from '../../../util/container.service';
import { AlertComponent } from './alert.component';
import { AlertProps } from './alert.data';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private container: Container) {}

  public openAlert(props: AlertProps = {}) {
    document.querySelector('app-alert')?.remove();

    const alert = this.container.vcr?.createComponent(AlertComponent).instance;

    alert!.message = props.message ?? 'Tem certeza que deseja continuar?';

    return new Promise<boolean>((resolve) => {
      alert!.response.subscribe((confirmed: boolean) => {
        resolve(confirmed);
      });
    });
  }
}
