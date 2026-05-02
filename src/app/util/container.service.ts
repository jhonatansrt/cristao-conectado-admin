import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Container {
  public vcr: ViewContainerRef | undefined;
}
