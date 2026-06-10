import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-active-members',
  templateUrl: './active-members.html',
  styleUrl: './active-members.scss',
  imports: [NgStyle],
})
export class ActiveMembers {
  protected readonly active = { count: 15, percentage: 75, color: '#4CAF50' };
  protected readonly inactive = { count: 5, percentage: 25, color: '#F44336' };

  protected get donutGradient(): string {
    return `conic-gradient(
      ${this.active.color} 0deg ${(this.active.percentage / 100) * 360}deg,
      ${this.inactive.color} ${(this.active.percentage / 100) * 360}deg 360deg
    )`;
  }
}
