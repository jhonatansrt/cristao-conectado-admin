import { Component, ElementRef, inject } from '@angular/core';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { DialogComponent } from '../../common/dialog/dialog.component';

@Component({
  selector: 'app-change-photo-dialog',
  standalone: true,
  imports: [DialogComponent, CardComponent],
  templateUrl: './change-photo-dialog.html',
  styleUrl: './change-photo-dialog.scss',
})
export class ChangePhotoDialog {
  private readonly el = inject(ElementRef);

  protected readonly options: { title: string; icons: CardIconAction[] }[] = [
    { title: 'Câmera', icons: [{ name: 'photo_camera', action: () => {} }] },
    { title: 'Galeria', icons: [{ name: 'photo_library', action: () => {} }] },
  ];

  public onClose(): void {
    this.el.nativeElement.remove();
  }
}
