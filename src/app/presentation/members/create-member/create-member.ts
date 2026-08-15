import { Component, Input, OnInit, ViewChild, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { CheckboxComponent } from '../../common/checkbox/checkbox';
import { Member } from '../../../domain/members';
import { TypeUser, TypeUserUtils } from '../../../domain/auth';
import { SelectComponent, SelectOption } from '../../common/select/select';
import { PositionsService } from '../../../application/positions/positions-service';
import { MembersService } from '../../../application/members/members-service';
import { UpdateMemberDTO } from '../../../domain/members/dto/update-member.dto';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-member',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule, CheckboxComponent, SelectComponent],
  templateUrl: './create-member.html',
  styleUrl: './create-member.scss',
})
export class CreateMember implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly positionsService = inject(PositionsService);
    private readonly membersService = inject(MembersService);

    @Input() public member?: Member;
    @ViewChild(ModalComponent) private modal?: ModalComponent;
    public loading = false;
    public positionOptions: SelectOption[] = [];
    public typeOptions: SelectOption[] = Object.values(TypeUser)
        .filter((value) => typeof value === 'number')
        .map((value) => ({
            label: TypeUserUtils.getLabel(value),
            value: value as TypeUser,
        }));

    public readonly form = this.fb.group({
        is_active: [false],
        is_baptized: [false],
        type: [null as TypeUser | null, Validators.required],
        position: ['', Validators.required],
    });

    ngOnInit(): void {
        console.log(this.member);
        this.getPositions();
        this.form.patchValue({
            is_active: this.member?.is_active,
            is_baptized: this.member?.is_baptized,
            type: this.member?.user.type ?? null,
            position: this.member?.memberPosition?.id ?? '',
        });
    }

    public closeModal(): void {
        this.modal?.closeModal();
    }

    public getPositions(): void {
        this.positionsService.getPositions().subscribe({
        next: (positions) => {
            this.positionOptions = positions.map((position) => ({
                label: position.name,
                value: position.id,
            }));
        },
        error: () => {},
        });
    }

    public onActiveChange(value: boolean): void {
        this.form.patchValue({
            is_active: value,
        });
    }
    public onBaptizedChange(value: boolean): void {
        this.form.patchValue({
            is_baptized: value,
        });
    }
    protected onCancel(): void {
        this.closeModal();
    }

    protected onConfirm(): void {
        if (this.form.invalid || this.loading) {
            this.form.markAllAsTouched();
            return;
        }

        const { is_baptized, is_active, type, position  } = this.form.getRawValue();

        if(!this.member){
            return;
        }
        const memberData: UpdateMemberDTO = {
            id: this.member?.id,
            position_id: position,
            is_active: is_active,
            is_baptized: is_baptized,
            user_id: this.member?.user.id,
            type: type
        }

        console.log(memberData);

        this.loading = true;
        this.membersService.updateChurchMember(memberData)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(() => this.closeModal());
    }
}
