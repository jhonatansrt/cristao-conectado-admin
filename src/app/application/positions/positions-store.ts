import { Injectable, Signal, signal } from '@angular/core';
import { Position } from '../../domain/positions';

@Injectable({
  providedIn: 'root',
})
export class PositionsStore {
  private readonly positions = signal<Position[]>([]);
  private readonly isLoading = signal(false);
  private readonly positionSelected = signal<Position | null>(null);

  public setPositions(positions: Position[]): void {
    this.positions.set(positions);
  }

  public setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  public setPositionSelected(position: Position | null): void {
    this.positionSelected.set(position);
  }

  public getPositions(): Signal<Position[]> {
    return this.positions;
  }

  public getIsLoading(): Signal<boolean> {
    return this.isLoading;
  }

  public getPositionSelected(): Signal<Position | null> {
    return this.positionSelected;
  }
}
