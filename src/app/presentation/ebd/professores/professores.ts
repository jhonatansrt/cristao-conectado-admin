import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ActionBarStore } from '../../../application/action-bar/action-bar-store';
import { TableColumn, TableRow, TableStore } from '../../../application/table/table-store';
import { Container } from '../../../util/container.service';
import { TableComponent } from '../../common/table/table.component';
import { EmptyCaseComponent } from '../../common/empty-case/empty-case.component';
import { CreateTeacher } from './create-teacher/create-teacher';
import { EbdTeacherService } from '../../../application/ebd-teacher/ebd-teacher.service';
import { MembersService } from '../../../application/members/members-service';
import { EbdTeacher } from '../../../domain/ebd/entities/ebd-teacher.entity';
import { Member } from '../../../domain/members';

@Component({
  selector: 'app-ebd-professores',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './professores.html',
  styleUrl: './professores.scss',
})
export class Professores implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly actionBarStore = inject(ActionBarStore);
  private readonly container = inject(Container);
  protected readonly isLoading = this.tableStore.isLoading();

  private readonly ebdTeacherService = inject(EbdTeacherService);
  private readonly membersService = inject(MembersService);

  private teachers: EbdTeacher[] = [];
  private members: Member[] = [];
  private teachersLoaded = false;
  private membersLoaded = false;

  constructor() {
    const columns: TableColumn[] = [{ key: 'name', header: 'Nome do professor' }];

    this.tableStore.setColumns(columns);
  }

  ngOnInit(): void {
    this.actionBarStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar professor',
        onClick: this.handleCreateTeacher,
      },
    ]);

    this.getEbdTeachers();
  }

  ngOnDestroy(): void {
    this.actionBarStore.clearButtonsActions();
  }

  private getEbdTeachers(): void {
    this.teachersLoaded = false;
    this.membersLoaded = false;
    this.tableStore.setLoading(true);

    this.ebdTeacherService.getEbdTeacher().subscribe((teachers) => {
      this.teachers = teachers;
      this.teachersLoaded = true;
      this.updateRows();
    });

    this.membersService.getMembersByChurch().subscribe((members) => {
      this.members = members;
      this.membersLoaded = true;
      this.updateRows();
    });
  }

  private updateRows(): void {
    if (!this.teachersLoaded || !this.membersLoaded) {
      return;
    }

    const rows = this.teachers.map((teacher) => ({
      id: teacher.id,
      name: this.members.find((member) => member.id === teacher.member_id)?.name ?? '',
    }));

    this.tableStore.setRows(rows);
    this.tableStore.setLoading(false);
  }

  private readonly handleCreateTeacher = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTeacher);
    componentRef?.instance.teacherCreated.subscribe(() => this.getEbdTeachers());
  };

  protected hasTeachers(): boolean {
    return this.tableStore.hasRows();
  }
}
