import { Component, signal } from '@angular/core';
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
    { label: 'Membro', count: 10, percentage: 40, color: '#4A90D9' },
    { label: 'Congregado', count: 4, percentage: 30, color: '#4CAF50' },
    { label: 'Visitante', count: 3, percentage: 15, color: '#FF9800' },
    { label: 'Master', count: 3, percentage: 15, color: '#7B61FF' },
  ];

  protected hoveredType = signal<MemberType | null>(null);

  protected get conicGradient(): string {
    let angle = 0;
    const stops = this.types.map((t) => {
      const start = angle;
      angle += (t.percentage / 100) * 360;
      return `${t.color} ${start}deg ${angle}deg`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  protected getSlicePath(type: MemberType, index: number): string {
    const total = this.types
      .slice(0, index)
      .reduce((sum, t) => sum + t.percentage, 0);
    const startAngle = (total / 100) * 360 - 90;
    const endAngle = startAngle + (type.percentage / 100) * 360;
    const r = 80;
    const cx = 80;
    const cy = 80;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    const largeArc = type.percentage > 50 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }
}
