import { Injectable, Signal, signal } from '@angular/core';

export interface EbdClass {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClassesStore {
  private readonly classes = signal<EbdClass[]>([
    { id: '1', name: 'Berçário', minAge: 0, maxAge: 3 },
    { id: '2', name: 'Maternal', minAge: 4, maxAge: 6 },
    { id: '3', name: 'Juniores', minAge: 7, maxAge: 10 },
    { id: '4', name: 'Adolescentes', minAge: 11, maxAge: 14 },
    { id: '5', name: 'Jovens', minAge: 15, maxAge: 24 },
    { id: '6', name: 'Adultos', minAge: 25, maxAge: 120 },
  ]);
  private readonly classSelected = signal<EbdClass | null>(null);

  public setClasses(classes: EbdClass[]): void {
    this.classes.set(classes);
  }

  public addClass(ebdClass: Omit<EbdClass, 'id'>): void {
    const id = crypto.randomUUID();
    this.classes.update((classes) => [...classes, { ...ebdClass, id }]);
  }

  public updateClass(ebdClass: EbdClass): void {
    this.classes.update((classes) =>
      classes.map((item) => (item.id === ebdClass.id ? { ...ebdClass } : item)),
    );
  }

  public removeClass(id: string): void {
    this.classes.update((classes) => classes.filter((item) => item.id !== id));
  }

  public setClassSelected(ebdClass: EbdClass | null): void {
    this.classSelected.set(ebdClass);
  }

  public getClasses(): Signal<EbdClass[]> {
    return this.classes;
  }

  public getClassSelected(): Signal<EbdClass | null> {
    return this.classSelected;
  }
}
