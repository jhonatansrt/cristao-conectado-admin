import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { InputComponent } from '../common/input/input';

@Component({
  selector: 'app-church',
  imports: [MatIconModule, InputComponent],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class Church {}
