import { Component, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AutoCompleteComponent, AutoCompleteOption } from '../../../common/auto-complete/auto-complete';
import { ButtonComponent } from '../../../common/button/button.component';
import { ModalComponent } from '../../../common/modal/modal.component';
import { EbdTeacherService } from '../../../../application/ebd-teacher/ebd-teacher.service';
import { MembersService } from '../../../../application/members/members-service';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';

export interface EbdTeacherCreated {
  id: string;
  memberId: string;
  memberName: string;
}

@Component({
  selector: 'app-create-teacher',
  imports: [ModalComponent, AutoCompleteComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-teacher.html',
  styleUrl: './create-teacher.scss',
})
export class CreateTeacher implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ebdTeacherService = inject(EbdTeacherService);
  private readonly membersService = inject(MembersService);
  private readonly capitalizeName = new CapitalizeNamePipe();

  public teacherCreated = output<EbdTeacherCreated>();

  @ViewChild(ModalComponent) private modal?: ModalComponent;

  public loading = false;

  protected memberOptions: AutoCompleteOption[] = [];

  public readonly form = this.fb.group({
    member: ['', Validators.required],
  });

  ngOnInit(): void {
    this.membersService.getMembersByChurch().subscribe((members) => {
      this.memberOptions = members.map((member) => ({
        id: member.user.id,
        label: this.capitalizeName.transform(member.user.name),
      }));
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

    const memberId = this.form.getRawValue().member ?? '';
    const memberName = this.memberOptions.find((option) => option.id === memberId)?.label ?? '';

    this.loading = true;
    this.ebdTeacherService
      .createEbdTeacher(memberId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response) => {
        if (response) {
          this.teacherCreated.emit({ id: response.id, memberId, memberName });
        }
        this.modal?.closeModal();
      });
  }
}
