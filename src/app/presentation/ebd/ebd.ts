import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { SegmentComponent, SegmentOption } from '../common/segment/segment';

@Component({
  selector: 'app-ebd',
  imports: [SegmentComponent, RouterOutlet],
  templateUrl: './ebd.html',
  styleUrl: './ebd.scss',
})
export class Ebd {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly selected = computed(() => {
    const segments = this.currentUrl().split('?')[0].split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';
    return this.options.some((option) => option.value === last) ? last : 'classes';
  });

  protected onSelect(value: string): void {
    this.router.navigate([value], { relativeTo: this.route });
  }
}
