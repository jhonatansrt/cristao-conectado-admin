import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

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
})
export class TypeOfMembers implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  protected readonly types: MemberType[] = [
    { label: 'Membro', count: 10, percentage: 40, color: '#4A90D9' },
    { label: 'Congregado', count: 4, percentage: 30, color: '#4CAF50' },
    { label: 'Visitante', count: 3, percentage: 15, color: '#FF9800' },
    { label: 'Master', count: 3, percentage: 15, color: '#7B61FF' },
  ];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.types.map((t) => t.label),
        datasets: [
          {
            data: this.types.map((t) => t.count),
            backgroundColor: this.types.map((t) => t.color),
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
