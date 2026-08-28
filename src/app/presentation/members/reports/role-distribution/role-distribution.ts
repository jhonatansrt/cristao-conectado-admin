import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Member, ReportRoleDTO } from '../../../../domain/members';

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
  @Input() public role?: ReportRoleDTO[];

  protected roles: RoleModel[] = [];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.roles = this.role?.map((item) => ({
      label: item.role,
      count: item.count,
      color: '#4A90D9',
    })) ?? [];

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
