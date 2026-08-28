import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ReportSummaryDTO } from '../../../../domain/members';

interface SummaryItem {
  value: number;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
  imports: [MatIcon],
})
export class Summary {
  @Input() public summary?: ReportSummaryDTO;

  protected items: SummaryItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        value: this.summary?.total ?? 0,
        label: 'Total de membros',
        icon: 'groups',
        color: 'var(--color-primary)',
      },
      {
        value: this.summary?.active ?? 0,
        label: 'Membros ativos',
        icon: 'check_circle',
        color: 'var(--color-success)',
      },
      {
        value: this.summary?.inactive ?? 0,
        label: 'Membros inativos',
        icon: 'cancel',
        color: 'var(--color-danger)',
      },
      {
        value: this.summary?.baptized ?? 0,
        label: 'Batizados',
        icon: 'water_drop',
        color: 'var(--color-primary-dark)',
      },
      {
        value: this.summary?.notBaptized ?? 0,
        label: 'Não batizados',
        icon: 'schedule',
        color: 'var(--color-warning)',
      },
    ];
  }
}
