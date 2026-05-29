import { Component } from '@angular/core';
import { ButtonComponent } from '../common/button/button.component';
import { ChurchData } from './church-data/church-data';

@Component({
  selector: 'app-church',
  imports: [ButtonComponent, ChurchData],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class ChurchPage {}
