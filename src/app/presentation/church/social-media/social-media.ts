import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../common/input/input';

@Component({
  selector: 'app-social-media',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './social-media.html',
  styleUrl: './social-media.scss',
})
export class SocialMedia {
  @Input({ required: true }) form!: FormGroup;
}
