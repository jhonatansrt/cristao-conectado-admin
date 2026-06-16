import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Member } from '../../../../domain/members';
import { CapitalizeNamePipe } from '../../../../pipes/capitalize-name.pipe';

@Component({
  selector: 'app-member-item',
  standalone: true,
  imports: [MatIconModule, CapitalizeNamePipe],
  templateUrl: './member-item.component.html',
  styleUrl: './member-item.component.scss',
})
export class MemberItemComponent {
  public readonly member = input.required<Member>();
  public readonly removable = input<boolean>(false);
  public readonly remove = output<void>();
}
