import { Component, ElementRef, EventEmitter, inject, OnInit, Output } from '@angular/core';

import { Member } from '../../../domain/members';
import { MembersService } from '../../../application/members/members-service';
import { AutocompleteComponent, AutocompleteOption } from '../../common/autocomplete/autocomplete';
import { ButtonComponent } from '../../common/button/button.component';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { MemberItemComponent } from './member-item/member-item.component';

@Component({
  selector: 'app-search-members',
  standalone: true,
  imports: [DialogComponent, AutocompleteComponent, ButtonComponent, MemberItemComponent],
  templateUrl: './search-members.component.html',
  styleUrl: './search-members.component.scss',
})
export class SearchMembersComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();

  private readonly el = inject(ElementRef);
  private readonly membersService = inject(MembersService);

  protected allMembers: Member[] = [];
  protected selectedMembers: Member[] = [];

  protected get memberOptions(): AutocompleteOption[] {
    return this.allMembers
      .filter((member) => !this.selectedMembers.some((selected) => selected.id === member.id))
      .map((member) => ({ id: member.id, label: member.name, data: member }));
  }

  ngOnInit(): void {
    this.membersService.getMembersByChurch().subscribe((members) => {
      this.allMembers = members;
    });
  }

  protected onSelectMember(option: AutocompleteOption): void {
    this.selectedMembers = [...this.selectedMembers, option.data as Member];
  }

  protected onRemoveMember(member: Member): void {
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
  }

  protected onConfirm(): void {
    this.el.nativeElement.remove();
    this.onCloseAll();
  }

  protected onClose(): void {
    this.closed.emit();
    this.el.nativeElement.remove();
  }

  protected onCloseAll(): void {
    this.closed.emit();
    this.el.nativeElement.remove();
  }
}
