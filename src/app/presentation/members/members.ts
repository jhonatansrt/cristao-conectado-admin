import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { MembersService } from '../../application/members/members-service';
import { MemberTransform } from '../../infrastructure/members/member-transform';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';

@Component({
  selector: 'app-members',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly membersService = inject(MembersService);
  protected readonly isLoading = this.tableStore.isLoading();
  protected readonly hasMembers = this.tableStore.hasRows;

  constructor() {
    const columns: TableColumn[] = [
      { key: 'name', header: 'Nome' },
      { key: 'email', header: 'E-mail' },
      { key: 'birthDate', header: 'Data de nascimento' },
    ];

    this.tableStore.setColumns(columns);
    this.loadMembers();
  }

  private loadMembers(): void {
    this.tableStore.setLoading(true);

    this.membersService.getMembersByChurch().subscribe({
      next: (members) => {
        this.tableStore.setRows(members.map(MemberTransform.toRow));
        this.tableStore.setLoading(false);
      },
      error: () => {
        this.tableStore.setLoading(false);
      },
    });
  }
}
