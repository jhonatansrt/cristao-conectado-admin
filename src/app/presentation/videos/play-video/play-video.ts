import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { DialogComponent } from '../../common/dialog/dialog.component';

@Component({
  selector: 'app-play-video',
  imports: [DialogComponent],
  templateUrl: './play-video.html',
  styleUrl: './play-video.scss',
})
export class PlayVideo implements OnInit {
  @Input({ required: true }) public videoId = '';
  public videoUrl: SafeResourceUrl = '';
  @ViewChild(DialogComponent) private dialog?: DialogComponent;

  private readonly sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.videoId}?autoplay=1`,
    );
  }

  public closeDialog(): void {
    this.dialog?.closeDialog();
  }
}
