import { Injectable, Signal, signal } from '@angular/core';
import { Member } from '../../domain/members/entities/member.entity';
import { Members } from '../../presentation/members/members';

@Injectable({
  providedIn: 'root',
})
export class MembersStore {
  private readonly members = signal<Member[]>([]);
  private readonly memberSelected = signal<Member | null>(null);

  public setMembers(members: Member[]): void {
    this.members.set(members);
  }

  public setMemberSelected(member: Member | null): void {
    this.memberSelected.set(member);
  }

  public getMembers(): Signal<Member[]> {
    return this.members;
  }

  public getMemberSelected(): Signal<Member | null> {
    return this.memberSelected;
  }
  public updateMember(updatedMember: Member): void {
    this.members.update((members) =>
        members.map((member) =>
            member.id === updatedMember.id
            ? updatedMember
            : member
        )
    );
  }
}

