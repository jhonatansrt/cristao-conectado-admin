import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReportByTypeDTO } from '../../../../domain/members';
import { TypeUser, TypeUserUtils } from '../../../../domain/auth';

Chart.register(...registerables);

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

  @Input() public typeMember?: ReportByTypeDTO[];
  protected types: MemberType[] = [];

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.types = this.typeMember?.map((item) => ({
      label: TypeUserUtils.getLabel(item.type),
      count: item.count,
      percentage: item.percentage,
      color: this.getTypeColor(item.type),
    })) ?? [];
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private getTypeColor(type: TypeUser): string {
    switch (type) {
      case TypeUser.MEMBER:
        return '#4A90D9';

      case TypeUser.CONGREGATED:
        return '#4CAF50';

      case TypeUser.VISITOR:
        return '#FF9800';

      case TypeUser.MASTER:
        return '#7B61FF';

      default:
        return '#999999';
    }
  }
  
  private buildChart(): void {
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
}
