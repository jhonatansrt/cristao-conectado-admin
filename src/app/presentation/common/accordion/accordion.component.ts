import { Component, computed, input, signal } from '@angular/core';

import { CardComponent, CardIconAction } from '../card/card.component';

@Component({
  selector: 'app-accordion',
  imports: [CardComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  standalone: true,
})
export class AccordionComponent {
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();

  protected readonly isOpen = signal(false);

  protected readonly headerIcons = computed<CardIconAction[]>(() => [
    {
      name: this.isOpen() ? 'expand_less' : 'expand_more',
      action: () => undefined,
      ariaLabel: this.isOpen() ? 'Fechar seção' : 'Abrir seção',
    },
  ]);

  protected toggle(): void {
    this.isOpen.update((value) => !value);
  }
}
