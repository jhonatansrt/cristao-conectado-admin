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
  private readonly pendingAvatarFile = signal<File | null>(null);
  private readonly pendingBannerFile = signal<File | null>(null);
  private readonly churchTypes = signal<{ value: string; label: string }[]>([]);

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
    const current = this.churchCached();
    if (!current) return;
    const updated = { ...current, address };
    this.churchCached.set(updated);
    this.storage.setStorage('churchLogged', updated);
  }

  public patchChurchType(type: { id: string; name: string }): void {
    const current = this.churchCached();
    if (!current) return;
    const updated = { ...current, type_id: type.id, type };
    this.churchCached.set(updated);
    this.storage.setStorage('churchLogged', updated);
  }

  public patchChurchUpdate(data: {
    name: string;
    phone: string;
    facebook?: string | null;
    instagram?: string | null;
    youtube?: string | null;
    type?: { id: string; name: string };
  }): void {
    const current = this.churchCached();
    if (!current) return;
    const updated: Church = {
      ...current,
      name: data.name,
      phone: data.phone,
      facebook: data.facebook ?? undefined,
      instagram: data.instagram ?? undefined,
      youtube: data.youtube ?? undefined,
      ...(data.type
        ? {
            type_id: data.type.id,
            type: data.type,
          }
        : {}),
    };
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

  public getAddress(): Signal<Address | null> {
    return this.addressSelected;
  }

  public getChurchCached(): Signal<Church | null> {
    return this.churchCached;
  }

  public setPendingAvatarFile(file: File | null): void {
    this.pendingAvatarFile.set(file);
  }

  public setPendingBannerFile(file: File | null): void {
    this.pendingBannerFile.set(file);
  }

  public getPendingAvatarFile(): File | null {
    return this.pendingAvatarFile();
  }

  public getPendingBannerFile(): File | null {
    return this.pendingBannerFile();
  }

  public setChurchTypes(types: { value: string; label: string }[]): void {
    this.churchTypes.set(types);
  }

  public getChurchTypes(): Signal<{ value: string; label: string }[]> {
    return this.churchTypes;
  }

  public clear(): void {
    this.church.set([]);
    this.isLoading.set(false);
    this.addressSelected.set(null);
    this.churchCached.set(null);
    this.pendingAvatarFile.set(null);
    this.pendingBannerFile.set(null);
  }
}
