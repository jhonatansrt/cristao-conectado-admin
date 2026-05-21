import { Component, ElementRef, inject } from '@angular/core';
import { CardComponent, CardIconAction } from '../../common/card/card.component';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { AuthService } from '../../../application/auth/auth-service';
import { UpdateAvatarDTO } from '../../../domain/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-photo-dialog',
  standalone: true,
  imports: [DialogComponent, CardComponent],
  templateUrl: './change-photo-dialog.html',
  styleUrl: './change-photo-dialog.scss',
})
export class ChangePhotoDialog {
  private readonly el = inject(ElementRef);
  private readonly authService = inject(AuthService);

  protected loading = false;

  protected readonly options: { title: string; icons: CardIconAction[] }[] = [
    { title: 'Galeria', icons: [{ name: 'photo_library', action: () => this.openFilePicker() }] },
  ];

  private openFilePicker(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        this.uploadAvatar({ file });
      }
    };
    input.click();
  }

  private uploadAvatar(props: UpdateAvatarDTO): void {
    this.loading = true;
    this.authService
      .updateAvatar(props)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(() => this.onClose());
  }

  public onClose(): void {
    this.el.nativeElement.remove();
  }
}
