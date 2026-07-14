import { Injectable, Signal, signal } from '@angular/core';

import { EbdGroupListItem } from '../../domain/ebd/entities/ebd-group.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdGroupSelectedStore {
  private readonly group = signal<EbdGroupListItem | null>(null);

  public setGroup(group: EbdGroupListItem | null): void {
    this.group.set(group);
  }

  public clearGroup(): void {
    this.group.set(null);
  }

  public getGroup(): Signal<EbdGroupListItem | null> {
    return this.group;
  }
}
