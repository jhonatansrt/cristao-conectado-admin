import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthStore } from '../auth/auth-store';
import { ToastService } from '../../presentation/common/toast/toast.service';
import { Church, ChurchType, CreateChurchDTO, IChurchRepository } from '../../domain/church';
import { ChurchStore } from './church-store';
import { UpadteImageDTO } from '../../domain/church/dto/update-image';
import { UpdateImageApiResponse } from '../../domain/church/dto/update-image-response';
import { AddressesStore } from '../addresses/addresses-store';
import { IAddressesRepository } from '../../domain/addresses';

@Injectable({
  providedIn: 'root',
})
export class ChurchService {
  private churchRepository = inject(IChurchRepository);
  private addressesRepository = inject(IAddressesRepository);
  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private churchStore = inject(ChurchStore);
  private addressesStore = inject(AddressesStore);

  public getChurch(): Observable<Church[]> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    if (!churchId) return of([]);
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
      error: () => this.churchStore.setIsLoading(false),
    });
  }

  public createChurch(props: CreateChurchDTO): Observable<void> {
    return this.churchRepository
      .createChurch(this.toChurchPayload(props))
      .pipe(
        switchMap((response) => {
          this.authStore.updateChurchId(response.id);
          const pending = this.addressesStore.getPendingAddress()();
          if (!pending) return of(void 0);
          return this.addressesRepository.createAddress({
            cep: pending.geocoded.cep,
            number: pending.geocoded.number,
            street: pending.geocoded.street,
            district: pending.geocoded.district,
            city: pending.geocoded.city,
            state: pending.geocoded.state,
            latitude: pending.geocoded.lat,
            longitude: pending.geocoded.lng,
            place: pending.place,
            churchId: response.id,
            isMain: true,
          }).pipe(
            tap(() => this.addressesStore.setPendingAddress(null)),
            map(() => void 0),
          );
        }),
        switchMap(() => this.getChurch()),
        tap((church) => this.churchStore.setChurch(church)),
        map(() => {
          this.toastService.openToast({ success: true, message: 'Igreja Criada com sucesso' });
        }),
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message });
          return throwError(() => e);
        }),
      );
  }

  public updateChurch(props: CreateChurchDTO): Observable<void> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    if (!churchId) return of();

    return this.churchRepository
      .updateChurch(churchId, this.toChurchPayload(props))
      .pipe(
        switchMap(() => this.getChurch()),
        tap((church) => this.churchStore.setChurch(church)),
        map(() => {
          this.toastService.openToast({ success: true, message: 'Igreja atualizada com sucesso' });
        }),
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

  public findById(): Observable<Church> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    if (!churchId) {
      this.churchStore.setAddress(null);
      return of();
    }
    return this.churchRepository.findById({ churchId }).pipe(
      tap((church) => this.churchStore.setAddress(church.address)),
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateChurchIcon(props: UpadteImageDTO): Observable<UpdateImageApiResponse> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    if (!churchId) return of();
    return this.churchRepository.updateChurchIcon(churchId, props).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  public updateChurchBanner(props: UpadteImageDTO): Observable<UpdateImageApiResponse> {
    const churchId = this.authStore.getUserLogged()()?.church_id;
    if (!churchId) return of();
    return this.churchRepository.updateChurchBanner(churchId, props).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message });
        return throwError(() => e);
      }),
    );
  }

  private toChurchPayload({ phone, name, address_id, facebook, instagram, youtube, type_id }: CreateChurchDTO) {
    return { phone, name, address_id, facebook, instagram, youtube, type_id };
  }
}
