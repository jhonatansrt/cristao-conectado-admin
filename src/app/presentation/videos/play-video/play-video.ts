import { Component, ElementRef, Input, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { DialogComponent } from '../../common/dialog/dialog.component';

@Component({
  selector: 'app-play-video',
  imports: [DialogComponent, MatIconModule],
  templateUrl: './play-video.html',
  styleUrl: './play-video.scss',
})
export class PlayVideo implements OnInit {
  @Input({ required: true }) public videoId = '';

  public indexDialog = 1;
  public videoUrl: SafeResourceUrl = '';

  private readonly sanitizer = inject(DomSanitizer);

  constructor(private readonly el: ElementRef) {}

  ngOnInit(): void {
    this.indexDialog = document.querySelectorAll('.background-dialog').length;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.videoId}?autoplay=1`,
    );
  }

  public closeDialog(): void {
    const selector = this.el.nativeElement.parentElement.tagName.toLowerCase();

    document.querySelector(selector + ':nth-last-of-type(1)')?.remove();
  }
}
