import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderStore {
  private title = signal<string>('Igreja');

  public setTitle(title: string): void {
    this.title.set(title);
  }

  public getTitle(): Signal<string> {
    return this.title;
  }
}
