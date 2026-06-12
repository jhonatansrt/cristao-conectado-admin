import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-active-members',
  templateUrl: './active-members.html',
  styleUrl: './active-members.scss',
})
export class ActiveMembers implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  protected readonly active = { count: 15, percentage: 75, color: '#4CAF50' };
  protected readonly inactive = { count: 5, percentage: 25, color: '#F44336' };

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Ativos', 'Inativos'],
        datasets: [
          {
            data: [this.active.count, this.inactive.count],
            backgroundColor: [this.active.color, this.inactive.color],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: '55%',
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
