import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../common/input/input';
import { ButtonComponent } from '../../common/button/button.component';

@Component({
  selector: 'app-social-media',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './social-media.html',
  styleUrl: './social-media.scss',
})
export class SocialMedia {
  @Input({ required: true }) form!: FormGroup;
  @Input() isButtonDisabled = false;
  @Input() isLoading = false;
  @Input() hasChurch = false;

  @Output() save = new EventEmitter<void>();
}
