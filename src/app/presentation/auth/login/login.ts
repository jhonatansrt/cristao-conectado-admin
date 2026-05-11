import { Component } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { InputComponent } from '../../common/input/input';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
