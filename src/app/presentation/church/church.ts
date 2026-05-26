import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '../common/input/input';
import { ChurchStore } from '../../application/church/church-store';
import { ChurchService } from '../../application/church/church-service';
import { ChurchType } from '../../domain/church';
import { SelectComponent } from '../common/select/select';
import { map } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-church',
  imports: [MatIconModule, InputComponent, SelectComponent],
  templateUrl: './church.html',
  styleUrl: './church.scss',
})
export class Church implements OnInit{
  private readonly fb = inject(FormBuilder);
  public readonly churchStore = inject(ChurchStore);
  private readonly churchService = inject(ChurchService);
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
}
