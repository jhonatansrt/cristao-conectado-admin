import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { TableComponent } from '../common/table/table.component';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { HeaderStore } from '../../application/header/header-store';
import { Container } from '../../util/container.service';
import { AlertService } from '../common/alert/alert.service';
import { TestimonialsService } from '../../application/testimonials/testimonials-service';
import { CreateTestimonial } from './create-testimonial/create-testimonial';

@Component({
  selector: 'app-testimonials',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly testimonialsService = inject(TestimonialsService);
  private readonly headerStore = inject(HeaderStore);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);
  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descrição' },
      { key: 'userName', header: 'Usuário' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.setButtonsActions();
    this.getTestimonials();
  }

  ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }

  private setButtonsActions() {
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar testemunho',
        onClick: this.handleCreateTestimonial,
      },
    ]);
  }

  private readonly handleCreateTestimonial = (): void => {
    const componentRef = this.container.vcr?.createComponent(CreateTestimonial);
    componentRef?.instance.testimonialCreated.subscribe(() => this.getTestimonials());
  };

  private getTestimonials(): void {
    this.tableStore.setLoading(true);

    this.testimonialsService
      .getTestimonials()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((rows) => {
        this.tableStore.setRows(
          rows.map((row) => ({
            ...row,
            actions: row.actions?.map((action) => ({
              ...action,
              onClick: () => this.handleDeleteTestimonial(String(row.id ?? '')),
            })),
          })),
        );
      });
  }

  private async handleDeleteTestimonial(testimonialId: string): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o testemunho?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    this.testimonialsService
      .deleteTestimonial(testimonialId)
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe(() => this.getTestimonials());
  }

  protected hasTestimonials(): boolean {
    return this.tableStore.hasRows();
  }
}
