import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportMaritalStatusDTO } from '../../../../domain/members';
import { MaritalStatus, MaritalStatusUtils } from '../../../../domain/auth';

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
export class MaritalStatusChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() public maritalStatus?: ReportMaritalStatusDTO[];
  protected statuses: MaritalStatusModel[] = [];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.statuses = this.maritalStatus?.map((item) => ({
      label: MaritalStatusUtils.getLabel(item.status),
      count: item.count,
      color: this.getStatusColor(item.status),
    })) ?? [];
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private getStatusColor(status: MaritalStatus): string {
  switch (status) {
    case MaritalStatus.MARRIED:
      return '#4A90D9';

    case MaritalStatus.SINGLE:
      return '#1FB892';

    case MaritalStatus.DIVORCED:
      return '#FF9800';

    case MaritalStatus.WIDOWED:
      return '#F44336';

    case MaritalStatus.LIVES_WITH_SOMEONE:
      return '#7B61FF';

    default:
      return '#999999';
  }
}
  private buildChart(): void {
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
}
