import { Injectable, Signal, signal } from '@angular/core';
import { Church } from '../../domain/church';

@Injectable({
  providedIn: 'root',
})
export class ChurchStore {
  private readonly church = signal<Church[]>([]);
  private readonly isLoading = signal(false);

  public setChurch(church: Church[]): void {
    this.church.set(church);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public getChurch(): Signal<Church[]> {
    return this.church;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }
}
