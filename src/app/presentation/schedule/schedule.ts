import { Component } from '@angular/core';
import { ButtonComponent } from '../common/button/button.component';
import { NativeCalendar } from './native-calendar/native-calendar';

@Component({
  selector: 'app-schedule',
  imports: [NativeCalendar, ButtonComponent],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',
})
export class Schedule {
  protected addEvent(): void {
    // TODO: Implement event creation flow.
  }
}
