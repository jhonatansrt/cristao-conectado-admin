import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { inject } from '@angular/core';
import { InputComponent } from '../../common/input/input';
import { SelectComponent } from '../../common/select/select';
import { CardComponent } from '../../common/card/card.component';
import { ChurchStore } from '../../../application/church/church-store';
import { ChurchService } from '../../../application/church/church-service';
import { Container } from '../../../util/container.service';
import { AddressList } from '../../schedule/address-list/address-list';
import { ImagesComponent } from '../images/images';

@Component({
  selector: 'app-church-data',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, CardComponent],
  templateUrl: './church-data.html',
  styleUrl: './church-data.scss',
})
export class ChurchData implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @ViewChild(ImagesComponent) private imagesComponent!: ImagesComponent;

  private readonly churchService = inject(ChurchService);
  private readonly churchStore = inject(ChurchStore);
  private readonly container = inject(Container);

  protected readonly currentAddress = this.churchStore.getAddres();

  churchTypes: { value: string; label: string }[] = [];

  ngOnInit(): void {
    this.churchService
      .listChurchType()
      .pipe(map((types) => types.map((t) => ({ value: t.id, label: t.name }))))
      .subscribe((types) => {
        this.churchTypes = types;
        if (!this.form.controls['type_id'].value) {
          this.form.patchValue({ type_id: types[0]?.value });
        }
      });
  }

  uploadPendingFiles(): void {
    this.imagesComponent.uploadPendingFiles();
  }

  protected openAddress(): void {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();
    return addr ? `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}` : '';
  }
}
