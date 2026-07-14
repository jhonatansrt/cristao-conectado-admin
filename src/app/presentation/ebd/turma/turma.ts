import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EbdGroupSelectedStore } from '../../../application/ebd-group/ebd-group-selected-store';
import { EbdGroupService } from '../../../application/ebd-group/ebd-group.service';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { SegmentComponent, SegmentOption } from '../../common/segment/segment';

type TurmaSection = 'alunos' | 'licoes';

@Component({
  selector: 'app-ebd-turma',
  imports: [SegmentComponent, EmptyCaseComponent],
  templateUrl: './turma.html',
  styleUrl: './turma.scss',
})
export class Turma implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ebdGroupSelectedStore = inject(EbdGroupSelectedStore);
  private readonly ebdGroupService = inject(EbdGroupService);

  protected readonly options: SegmentOption[] = [
    { label: 'Alunos', value: 'alunos', icon: 'group' },
    { label: 'Lições', value: 'licoes', icon: 'menu_book' },
  ];

  protected readonly selected = signal<TurmaSection>('alunos');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && this.ebdGroupSelectedStore.getGroup()()?.id !== id) {
      this.ebdGroupService.getEbdGroup().subscribe((groups) => {
        this.ebdGroupSelectedStore.setGroup(groups.find((group) => group.id === id) ?? null);
      });
    }
  }

  protected onSelect(value: string): void {
    this.selected.set(value as TurmaSection);
  }
}
