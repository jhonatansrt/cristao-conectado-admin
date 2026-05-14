import { Component } from '@angular/core';
import { NativeCalendar } from './native-calendar/native-calendar';

@Component({
  selector: 'app-schedule',
  imports: [NativeCalendar],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {}
