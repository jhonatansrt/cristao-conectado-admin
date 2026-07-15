import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

import { ToastService } from '../../presentation/common/toast/toast.service';
import { IEbdLessonRepository } from '../../domain/ebd/ebd-lesson.repository';
import { CreateEbdLessonResponseDTO } from '../../domain/ebd/dto/create-ebd-lesson-response.dto';
import { EbdLesson } from '../../domain/ebd/entities/ebd-lesson.entity';

@Injectable({
  providedIn: 'root',
})
export class EbdLessonService {
  private ebdLessonRepository = inject(IEbdLessonRepository);
  private toastService = inject(ToastService);

  public getEbdLessons(groupId: string): Observable<EbdLesson[]> {
    return this.ebdLessonRepository.getEbdLessons({ group_id: groupId }).pipe(
      catchError((e) => {
        this.toastService.openToast({ message: e?.error?.message || 'Erro ao carregar lições' });
        return throwError(() => e);
      }),
    );
  }

  public createEbdLesson(
    groupId: string,
    title: string,
    displayOrder: number,
    done = false,
  ): Observable<CreateEbdLessonResponseDTO> {
    return this.ebdLessonRepository
      .postEbdLesson({
        group_id: groupId,
        title,
        display_order: displayOrder,
        done,
      })
      .pipe(
        catchError((e) => {
          this.toastService.openToast({ message: e?.error?.message || 'Erro ao criar lição' });
          return throwError(() => e);
        }),
      );
  }
}
