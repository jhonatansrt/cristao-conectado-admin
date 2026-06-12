import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';
import { PositionsService } from '../../../application/positions/positions-service';
import { PositionsStore } from '../../../application/positions/positions-store';

@Component({
  selector: 'app-create-position',
  imports: [ModalComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-position.html',
  styleUrl: './create-position.scss',
})
export class CreatePosition implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly positionsService = inject(PositionsService);
  private readonly positionsStore = inject(PositionsStore);

  @ViewChild(ModalComponent) private modal?: ModalComponent;
  public loading = false;

  public readonly form = this.fb.group({
    name: ['', Validators.required],
  });

  protected get positionSelected() {
    return this.positionsStore.getPositionSelected()();
  }

  ngOnInit(): void {
    const position = this.positionSelected;

    if (position) {
      this.form.patchValue({ name: position.name });
    }
  }

  protected onCancel(): void {
    this.positionsStore.setPositionSelected(null);
    this.modal?.closeModal();
  }

  protected onConfirm(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();
    const position = this.positionSelected;

    this.loading = true;

    const request = position
      ? this.positionsService.updatePosition(position.id, name ?? '')
      : this.positionsService.createPosition(name ?? '');

    // request.pipe(finalize(() => (this.loading = false))).subscribe(() => {
    //   this.positionsStore.setPositionSelected(null);
    //   this.modal?.closeModal();
    // });
  }
}
