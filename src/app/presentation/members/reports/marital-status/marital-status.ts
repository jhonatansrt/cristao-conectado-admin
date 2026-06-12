import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface MaritalStatusModel {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.html',
  styleUrl: './marital-status.scss',
})
export class MaritalStatus implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  protected readonly statuses: MaritalStatusModel[] = [
    { label: 'Casado(a)', count: 9, color: '#4A90D9' },
    { label: 'Solteiro(a)', count: 7, color: '#1FB892' },
    { label: 'Divorciado(a)', count: 2, color: '#FF9800' },
    { label: 'Viúvo(a)', count: 1, color: '#F44336' },
    { label: 'União Estável', count: 1, color: '#7B61FF' },
  ];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.statuses.map((s) => s.label),
        datasets: [
          {
            data: this.statuses.map((s) => s.count),
            backgroundColor: this.statuses.map((s) => s.color),
            borderRadius: 4,
            maxBarThickness: 48,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 3 },
          },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
