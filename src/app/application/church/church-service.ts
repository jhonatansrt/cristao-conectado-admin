import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { Church, ChurchType, CreateChurchDTO, IChurchRepository } from '../../domain/church';
import { ChurchStore } from './church-store';
import { AddressesStore } from '../addresses/addresses-store';

@Injectable({
  providedIn: 'root',
})
export class ChurchService {
  private churchRepository = inject(IChurchRepository);
  private authStore = inject(AuthStore);
  private addressStore = inject(AddressesStore);
  private toastService = inject(ToastService);
  private churchStore = inject(ChurchStore);

  public getChurch(): Observable<Church[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;

    if (!churchId) {
      return of([]);
    }

    return this.churchRepository.getChurch({ churchId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public loadChurch(): void {
    this.churchStore.setIsLoading(true);
    this.getChurch().subscribe({
      next: (church) => {
        this.churchStore.setChurch(church);
        this.churchStore.setIsLoading(false);
      },
      error: () => {
        this.churchStore.setIsLoading(false);
      },
    });
  }

  public createChurch(props: CreateChurchDTO): Observable<void> {
    return this.churchRepository.createChurch({
        phone: props.phone,
        name: props.name,
        address_id: props.address_id,
        facebook: props.facebook,
        instagram: props.instagram,
        youtube: props.youtube,
        type_id: props.type_id
    }).pipe(
      switchMap(() => this.getChurch()),
      tap((church) => this.churchStore.setChurch(church)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateChurch(props: CreateChurchDTO): Observable<void> {
    return this.churchRepository.updateChurch('ChurchId', {
        phone: props.phone,
        name: props.name,
        address_id: props.address_id,
        facebook: props.facebook,
        instagram: props.instagram,
        youtube: props.youtube,
        type_id: props.type_id
    }).pipe(
      switchMap(() => this.getChurch()),
      tap((church) => this.churchStore.setChurch(church)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public deleteChurch(id: string): Observable<void> {
    return this.churchRepository.deleteChurch(id).pipe(
      switchMap(() => this.getChurch()),
      tap((church) => this.churchStore.setChurch(church)),
      map(() => void 0),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public listChurchType(): Observable<ChurchType[]> {
    return this.churchRepository.listChurchType().pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }
}
