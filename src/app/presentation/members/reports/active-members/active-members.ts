import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportStatusDTO } from '../../../../domain/members';

Chart.register(...registerables);

@Component({
  selector: 'app-active-members',
  templateUrl: './active-members.html',
  styleUrl: './active-members.scss',
})
export class ActiveMembers implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') private readonly chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() public activeMembers?: ReportStatusDTO;
  @Input() public inactiveMembers?: ReportStatusDTO;
  protected active = {
    count: 0,
    percentage: 0,
    color: '#4CAF50',
  };

  protected inactive = {
    count: 0,
    percentage: 0,
    color: '#F44336',
  };

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.active = {
      count: this.activeMembers?.count ?? 0,
      percentage: this.activeMembers?.percentage ?? 0,
      color: '#4CAF50',
    };

    this.inactive = {
      count: this.inactiveMembers?.count ?? 0,
      percentage: this.inactiveMembers?.percentage ?? 0,
      color: '#F44336',
    };
    
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
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
}
