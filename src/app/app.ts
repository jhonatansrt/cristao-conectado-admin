import { Component, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { Container } from './util/container.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [IonApp, IonRouterOutlet],
})
export class App {
  @ViewChild('main', { static: true, read: ViewContainerRef })
  private vcr!: ViewContainerRef;

  private readonly container = inject(Container);

  ngOnInit(): void {
    this.container.vcr = this.vcr;
  }
}
