import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { Member } from '../../../domain/members';
import { MembersService } from '../../../application/members/members-service';
import { ButtonComponent } from '../../common/button/button.component';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { InputComponent } from '../../common/input/input';
import { MemberItemComponent } from './member-item/member-item.component';

@Component({
  selector: 'app-search-members',
  standalone: true,
  imports: [DialogComponent, InputComponent, ButtonComponent, MatIconModule, MemberItemComponent],
  templateUrl: './search-members.component.html',
  styleUrl: './search-members.component.scss',
})
export class SearchMembersComponent implements OnInit {
  @ViewChild(InputComponent) private readonly searchInput!: InputComponent;

  private readonly el = inject(ElementRef);
  private readonly membersService = inject(MembersService);

  protected allMembers: Member[] = [];
  protected filteredMembers: Member[] = [];
  protected selectedMembers: Member[] = [];

  ngOnInit(): void {
    this.membersService.getMembersByChurch().subscribe((members) => {
      this.allMembers = members;
    });
  }

  protected onSearch(value: string): void {
    if (!value.trim()) {
      this.filteredMembers = [];
      return;
    }

    const lower = value.toLowerCase();
    this.filteredMembers = this.allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) &&
        !this.selectedMembers.some((s) => s.id === m.id),
    );
  }

  protected onSelectMember(member: Member): void {
    this.selectedMembers = [...this.selectedMembers, member];
    this.filteredMembers = [];
    this.searchInput?.reset();
  }

  protected onRemoveMember(member: Member): void {
    this.selectedMembers = this.selectedMembers.filter((m) => m.id !== member.id);
  }

  protected onConfirm(): void {
    this.el.nativeElement.remove();
  }

  protected onClose(): void {
    this.el.nativeElement.remove();
  }
}
