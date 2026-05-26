import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../common/input/input';
import { ChurchStore } from '../../application/church/church-store';
import { ChurchService } from '../../application/church/church-service';
import { SelectComponent } from '../common/select/select';
import { map } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Container } from '../../util/container.service';
import { AddressList } from '../schedule/address-list/address-list';
import { CardComponent } from '../common/card/card.component';

@Component({
  selector: 'app-church',
  imports: [MatIconModule, InputComponent, SelectComponent, ReactiveFormsModule, CardComponent],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class Church implements OnInit{
  private readonly container = inject(Container);
  private readonly fb = inject(FormBuilder);
  public readonly churchStore = inject(ChurchStore);
  private readonly churchService = inject(ChurchService);

  public currentAddress = this.churchStore.getAddres();
  protected chuchType: any = [];
    
  public readonly form = this.fb.group({
    phone: ['', Validators.required],
    name: ['', Validators.required],
    address_id: ['', Validators.required],
    type_id: ['', Validators.required],
    facebook: [''],
    instagram: [''],
    youtube: [''],
  });

  constructor(){
  }

  ngOnInit(): void {
    this.lisChurchType();
    this.loadChurch();
  }

  private loadChurch(){
    this.churchService
    .findById()
      .subscribe({
        next: (church) => {
            this.form.patchValue({
              phone: church.phone,
              name: church.name,
              address_id: church.address.id,
              type_id: church.type.id,
              facebook: church.facebook,
              instagram: church.instagram,
              youtube: church.youtube
            })
        }
      }
    )
  }

  private lisChurchType(){
    this.churchService
      .listChurchType()
        .pipe(
        map(types =>
          types.map(type => ({
            value: type.id,
            label: type.name,
          }))
        )
      )
      .subscribe({
        next: (listChurch) => {
          this.chuchType = listChurch;
        },
        error: () => {},
      });
  }

  public openAddress(){
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }

  protected addressDescription(): string {
    const addr = this.currentAddress();

    if (!addr) {
      return 'Selecione um Endereço:';
    }

    return `${addr.street}, ${addr.district}, ${addr.city} - ${addr.state}`;
  }

  protected onChangeAddress(): void {
    const modal = this.container.vcr?.createComponent(AddressList).instance;
    modal!.isChurch = true;
  }
}
