import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuStore {
  private readonly isOpen = signal<boolean>(false);

  public open(): void {
    this.isOpen.set(true);
  }

  public close(): void {
    this.isOpen.set(false);
  }

  public toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  public getIsOpen(): Signal<boolean> {
    return this.isOpen;
  }
}
