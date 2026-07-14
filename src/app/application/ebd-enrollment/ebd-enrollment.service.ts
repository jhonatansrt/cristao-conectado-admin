import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { ToastService } from '../../presentation/common/toast/toast.service';
import { IEbdEnrollmentRepository } from '../../domain/ebd/ebd-enrollment.repository';
import { CreateEbdEnrollmentResponseDTO } from '../../domain/ebd/dto/create-ebd-enrollment-response.dto';
import { EbdEnrollment } from '../../domain/ebd/entities/ebd-enrollment.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdEnrollmentService {
  private ebdEnrollmentRepository = inject(IEbdEnrollmentRepository);
  private toastService = inject(ToastService);

  public getEbdEnrollments(groupId: string): Observable<EbdEnrollment[]> {
    return this.ebdEnrollmentRepository.getEbdEnrollments({ group_id: groupId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message || 'Erro ao carregar alunos' });
        return throwError(() => e);
      }),
    );
  }

  public createEbdEnrollment(
    userId: string,
    groupId: string,
    responsibleMemberId?: string,
  ): Observable<CreateEbdEnrollmentResponseDTO> {
    return this.ebdEnrollmentRepository
      .postEbdEnrollment({
        user_id: userId,
        group_id: groupId,
        responsible_member_id: responsibleMemberId,
      })
      .pipe(
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message || 'Erro ao matricular aluno' });
          return throwError(() => e);
        }),
      );
  }
}
