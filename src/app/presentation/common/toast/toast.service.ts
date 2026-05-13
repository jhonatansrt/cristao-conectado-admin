import { Injectable } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastProps } from './toast.data';
import { Container } from '../../../util/container.service';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private timeout?: ReturnType<typeof setTimeout>;

  constructor(private container: Container) {}

  private initTimeout() {
    this.timeout = setTimeout(() => {
      this.closeToast();
    }, 10000);
  }

  private clearTimeout() {
    clearTimeout(this.timeout);
  }

  public openToast(props: ToastProps) {
    this.clearTimeout();
    document.querySelector('app-toast')?.remove();

    const toast = this.container.vcr?.createComponent(ToastComponent).instance;
    toast!.success = props.success || false;
    toast!.title = props.title ?? (props.success ? 'Concluído' : 'Atenção');
    toast!.message =
      props.message ||
      (props.success ? 'Ação realizada com sucesso' : 'Ocorreu um erro inesperado');

    this.initTimeout();
  }

  public closeToast() {
    this.clearTimeout();
    document.getElementById('toast')?.classList.add('fadeOut');

    setTimeout(() => {
      document.querySelector('app-toast')?.remove();
    }, 200);
  }
}
