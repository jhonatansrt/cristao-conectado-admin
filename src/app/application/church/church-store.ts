import { inject, Injectable, Signal, signal } from '@angular/core';
import { Church } from '../../domain/church';
import { Address } from '../../domain/addresses';
import { IStorageRepository } from '../../domain/storage';

@Injectable({
  providedIn: 'root',
})
export class ChurchStore {
  private storage = inject(IStorageRepository);
  private readonly church = signal<Church[]>([]);
  private readonly isLoading = signal(false);
  private readonly addressSelected = signal<Address | null>(null);
  private readonly churchCached = signal<Church | null>(null);

  public setChurch(church: Church[]): void {
    this.church.set(church);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public setAddress(addressSelected: Address | null): void {
    this.addressSelected.set(addressSelected);
  }

  public setChurchCached(church: Church): void {
    this.churchCached.set(church);
    this.storage.setStorage('churchLogged', church);
  }

  public patchChurchImage(field: 'church_avatar' | 'church_banner', url: string): void {
    const current = this.churchCached();
    if (!current) return;
    const updated = { ...current, [field]: url };
    this.churchCached.set(updated);
    this.storage.setStorage('churchLogged', updated);
  }

  public patchChurchAddress(address: Address): void {
    this.addressSelected.set(address);
    const current = this.churchCached();
    if (!current) return;
    const updated = { ...current, address };
    this.churchCached.set(updated);
    this.storage.setStorage('churchLogged', updated);
  }

  public async loadChurchFromStorage(): Promise<void> {
    const church = await this.storage.getStorage('churchLogged');
    if (church) {
      this.churchCached.set(church);
    }
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

  public getChurchCached(): Signal<Church | null> {
    return this.churchCached;
  }

  public clear(): void {
    this.church.set([]);
    this.isLoading.set(false);
    this.addressSelected.set(null);
    this.churchCached.set(null);
  }
}
