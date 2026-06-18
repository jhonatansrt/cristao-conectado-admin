import { Injectable, Signal, signal } from '@angular/core';
import { Position } from '../../domain/positions';

@Injectable({
  providedIn: 'root',
})
export class PositionsStore {
  private readonly positions = signal<Position[]>([]);
  private readonly positionSelected = signal<Position | null>(null);

  public setPositions(positions: Position[]): void {
    this.positions.set(positions);
  }

  public setPositionSelected(position: Position | null): void {
    this.positionSelected.set(position);
  }

  public getMemberPositions(): Signal<Position[]> {
    return this.positions;
  }

  public getPositionSelected(): Signal<Position | null> {
    return this.positionSelected;
  }
}
