import { Component } from '@angular/core';
import { InputComponent } from '../../common/input/input';
import { ModalComponent } from '../../common/modal/modal.component';

@Component({
  selector: 'app-create-account',
  imports: [InputComponent, ModalComponent],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss',
})
export class CreateAccount {}
