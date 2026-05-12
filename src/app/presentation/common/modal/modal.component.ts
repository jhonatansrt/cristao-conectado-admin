import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ButtonClass } from '../button/button.data';
import { ButtonComponent } from '../button/button.component';

interface ModalFooterButton {
  disabled: boolean;
  loading: boolean;
  btnClass: ButtonClass;
  label: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [ButtonComponent],
})
export class ModalComponent implements OnInit {
  @Input() public title: string | undefined;
  @Input() public buttons: ModalFooterButton[] = [];
  public indexModal = 1;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.indexModal = document.querySelectorAll('.background-modal').length;
  }

  public closeModal() {
    const selector = this.el.nativeElement.parentElement.tagName.toLowerCase();

    document.querySelector('#modal' + this.indexModal)?.classList.add('close-background-modal');

    document
      .querySelector('#modal' + this.indexModal + ' .content-modal')
      ?.classList.add('close-content-modal');

    setTimeout(() => {
      document.querySelector(selector + ':nth-last-of-type(1)')?.remove();
    }, 100);
  }
}
