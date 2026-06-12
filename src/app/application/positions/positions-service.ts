import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { IPositionsRepository, Position } from '../../domain/positions';
import { AuthStore } from '../auth/auth-store';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { PositionsStore } from './positions-store';

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  private positionsRepository = inject(IPositionsRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private positionsStore = inject(PositionsStore);

  public getPositions(): Observable<Position[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.positionsRepository.getPositions({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public loadPositions(): Observable<Position[]> {
    return this.getPositions().pipe(
      tap((positions) => this.positionsStore.setPositions(positions)),
    );
  }

  public createPosition(name: string): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of(void 0);
    }

    return this.positionsRepository.createPosition({ churchId, name }).pipe(
      switchMap(() => this.getPositions()),
      tap((positions) => this.positionsStore.setPositions(positions)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updatePosition(id: string, name: string) {
    const churchId = this.authStore.getUserLogged()()?.church_id ?? '';

    this.positionsRepository.updatePosition(id, { churchId, name }).pipe(
      switchMap(() => this.getPositions()),
      tap((positions) => this.positionsStore.setPositions(positions)),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deletePosition(id: string) {
    this.positionsRepository.deletePosition(id).pipe(
      switchMap(() => this.getPositions()),
      tap((positions) => this.positionsStore.setPositions(positions)),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
