import { Component, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AutoCompleteComponent, AutoCompleteOption } from '../../../common/auto-complete/auto-complete';
import { ButtonComponent } from '../../../common/button/button.component';
import { ModalComponent } from '../../../common/modal/modal.component';
import { SelectComponent, SelectOption } from '../../../common/select/select';
import { EbdEnrollmentService } from '../../../../application/ebd-enrollment/ebd-enrollment.service';
import { EbdGroupSelectedStore } from '../../../../application/ebd-group/ebd-group-selected-store';
import { MembersService } from '../../../../application/members/members-service';

@Component({
  selector: 'app-create-enrollment',
  imports: [ModalComponent, SelectComponent, AutoCompleteComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-enrollment.html',
  styleUrl: './create-enrollment.scss',
})
export class CreateEnrollment implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ebdEnrollmentService = inject(EbdEnrollmentService);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);
  private readonly membersService = inject(MembersService);

  public enrollmentCreated = output<void>();

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public loading = false;

  protected studentOptions: SelectOption[] = [];
  protected responsibleOptions: AutoCompleteOption[] = [];

  public readonly form = this.fb.group({
    student: ['', Validators.required],
    responsible: [''],
  });

  ngOnInit(): void {
    this.membersService.getMembersByChurch().subscribe((members) => {
      this.studentOptions = members.map((member) => ({ label: member.name, value: member.id }));
      this.responsibleOptions = members.map((member) => ({ id: member.id, label: member.name }));
    });
  }

  protected onCancel(): void {
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const groupId = this.ebdGroupSelectedStore.getGroup()()?.id;

    if (!groupId) {
      return;
    }

    const { student, responsible } = this.form.getRawValue();
    const userId = student ?? '';
    const responsibleMemberId = responsible?.trim() || undefined;

    this.loading = true;
    this.ebdEnrollmentService
      .createEbdEnrollment(userId, groupId, responsibleMemberId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => {
        this.enrollmentCreated.emit();
        this.modal?.closeModal();
      });
  }
}
