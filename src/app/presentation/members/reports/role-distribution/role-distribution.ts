import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RoleModel {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-role-distribution',
  templateUrl: './role-distribution.html',
  styleUrl: './role-distribution.scss',
})
export class RoleDistribution implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  protected readonly roles: RoleModel[] = [
    { label: 'Membro Regular', count: 9, color: '#4A90D9' },
    { label: 'Líder de Célula', count: 3, color: '#4A90D9' },
    { label: 'Pastor', count: 1, color: '#4A90D9' },
    { label: 'Diácono', count: 2, color: '#4A90D9' },
    { label: 'Auxiliar', count: 2, color: '#4A90D9' },
    { label: 'Secretário', count: 1, color: '#4A90D9' },
    { label: 'Tesoureiro', count: 1, color: '#4A90D9' },
  ];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.roles.map((r) => r.label),
        datasets: [
          {
            data: this.roles.map((r) => r.count),
            backgroundColor: this.roles.map((r) => r.color),
            borderRadius: 4,
            maxBarThickness: 24,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 3 },
          },
          y: {
            grid: { display: false },
          },
        },
      },
    });
  }
}
