import { Component } from '@angular/core';
import { Summary } from './summary/summary';

@Component({
  selector: 'app-reports',
  imports: [Summary],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {}
