import { Injectable, Signal, signal } from '@angular/core';
import { Church } from '../../domain/church';
import { Address } from '../../domain/addresses';

@Injectable({
  providedIn: 'root',
})
export class ChurchStore {
  private readonly church = signal<Church[]>([]);
  private readonly isLoading = signal(false);
  private readonly addressSelected = signal<Address | null>(null);
  private churchAvatar = signal<string | null>(null);
  private churchBanner = signal<string | null>(null);

  public setChurch(church: Church[]): void {
    this.church.set(church);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public setAddress(addressSelected: Address | null): void {
    this.addressSelected.set(addressSelected);
  }

  public getChurch(): Signal<Church[]> {
    return this.church;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public getAddres(): Signal<Address | null> {
    return this.addressSelected;
  }
}
