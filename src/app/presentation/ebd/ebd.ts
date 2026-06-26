import { Component, signal } from '@angular/core';
import { SegmentComponent, SegmentOption } from '../common/segment/segment';

@Component({
  selector: 'app-ebd',
  imports: [SegmentComponent],
  templateUrl: './ebd.html',
  styleUrl: './ebd.scss',
})
export class Ebd {
  protected readonly options: SegmentOption[] = [
    { label: 'Dashboard', value: 'dashboard', icon: 'dashboard' },
    { label: 'Alunos', value: 'alunos', icon: 'person_outline' },
    { label: 'Professores', value: 'professores', icon: 'school' },
    { label: 'Classes', value: 'classes', icon: 'groups' },
    { label: 'Turmas', value: 'turmas', icon: 'meeting_room' },
    { label: 'Matrículas', value: 'matriculas', icon: 'how_to_reg' },
    { label: 'Frequência', value: 'frequencia', icon: 'fact_check' },
    { label: 'Conteúdo', value: 'conteudo', icon: 'menu_book' },
    { label: 'Avisos', value: 'avisos', icon: 'warning_amber' },
    { label: 'Relatórios', value: 'relatorios', icon: 'bar_chart' },
  ];

  protected readonly selected = signal<string>('dashboard');

  protected onSelect(value: string): void {
    this.selected.set(value);
  }
}
