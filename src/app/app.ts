import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Container } from './util/container.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('main', { static: true, read: ViewContainerRef })
  private vcr!: ViewContainerRef;

  private readonly container = inject(Container);

  ngOnInit(): void {
    this.container.vcr = this.vcr;
  }
}
