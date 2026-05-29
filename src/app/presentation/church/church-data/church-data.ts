import { Component, Input, Output, EventEmitter, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputComponent } from '../../common/input/input';
import { SelectComponent } from '../../common/select/select';
import { CardComponent } from '../../common/card/card.component';
import { Address } from '../../../domain/addresses/entities/address.entity';

@Component({
  selector: 'app-church-data',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    InputComponent,
    SelectComponent,
    CardComponent,
  ],
  templateUrl: './church-data.html',
  styleUrl: './church-data.scss',
})
export class ChurchData {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) churchTypes!: { value: string; label: string }[];
  @Input({ required: true }) currentAddress!: Signal<Address | null | undefined>;
  @Input({ required: true }) addressDescription!: string;
  @Input() churchAvatar: string | null = null;
  @Input() churchBanner: string | null = null;
  @Input() uploadingPhoto = false;
  @Input() uploadingBanner = false;

  @Output() openFilePickerAvatarClick = new EventEmitter<void>();
  @Output() openFilePickerBannerClick = new EventEmitter<void>();
  @Output() openAddressClick = new EventEmitter<void>();
}
