import { Component, inject } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { MembersService } from '../../application/members/members-service';
import { CapitalizeNamePipe } from '../../pipes/capitalize-name.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { Member } from '../../domain/members';
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
  private readonly capitalizeNamePipe = new CapitalizeNamePipe();
  private readonly formatDatePipe = new FormatDatePipe();
  protected readonly isLoading = this.tableStore.isLoading();

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
        this.tableStore.setRows(members.map((member) => this.buildRow(member)));
        this.tableStore.setLoading(false);
      },
      error: () => {
        this.tableStore.setLoading(false);
      },
    });
  }

  private buildRow(member: Member): TableRow {
    return {
      id: member.id,
      name: this.capitalizeNamePipe.transform(member.name),
      email: member.email,
      birthDate: this.formatDatePipe.transform(member.birth_date),
    };
  }

  protected hasMembers(): boolean {
    return this.tableStore.hasRows();
  }
}
