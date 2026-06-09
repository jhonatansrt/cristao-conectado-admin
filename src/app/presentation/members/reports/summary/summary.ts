import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

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
  protected readonly items: SummaryItem[] = [
    { value: 20, label: 'Total de membros', icon: 'groups', color: 'var(--color-primary)' },
    { value: 15, label: 'Membros ativos', icon: 'check_circle', color: 'var(--color-success)' },
    { value: 5, label: 'Membros inativos', icon: 'cancel', color: 'var(--color-danger)' },
    { value: 12, label: 'Batizados', icon: 'water_drop', color: 'var(--color-primary-dark)' },
    { value: 7, label: 'Não batizados', icon: 'schedule', color: 'var(--color-warning)' },
  ];
}
