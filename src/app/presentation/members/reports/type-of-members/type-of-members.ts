import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';

interface MemberType {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-type-of-members',
  templateUrl: './type-of-members.html',
  styleUrl: './type-of-members.scss',
  imports: [NgStyle],
})
export class TypeOfMembers {
  protected readonly types: MemberType[] = [
    { label: 'Membro', count: 10, percentage: 50, color: '#4A90D9' },
    { label: 'Congregado', count: 4, percentage: 20, color: '#4CAF50' },
    { label: 'Visitante', count: 3, percentage: 15, color: '#FF9800' },
    { label: 'Master', count: 3, percentage: 15, color: '#7B61FF' },
  ];

  protected get conicGradient(): string {
    let angle = 0;
    const stops = this.types.map((t) => {
      const start = angle;
      angle += (t.percentage / 100) * 360;
      return `${t.color} ${start}deg ${angle}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }
}
