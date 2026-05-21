import { Component, computed, input, output, signal } from '@angular/core';

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
  public readonly description = input.required<string | null>();

  public readonly opened = output<void>();

  protected readonly isOpen = signal(false);

  protected readonly headerIcons = computed<CardIconAction[]>(() => [
    {
      name: this.isOpen() ? 'expand_less' : 'expand_more',
      action: () => this.toggle(),
      ariaLabel: this.isOpen() ? 'Fechar seção' : 'Abrir seção',
    },
  ]);

  protected toggle(): void {
    this.isOpen.update((value) => !value);
    if (this.isOpen()) {
      this.opened.emit();
    }
  }
}
