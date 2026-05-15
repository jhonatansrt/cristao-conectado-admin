import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { HeaderStore } from '../../application/header/header-store';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-videos',
  imports: [TableComponent],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class Videos implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly headerStore = inject(HeaderStore);

  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'videoId', header: 'ID do vídeo' },
      { key: 'featured', header: 'Destaque' },
      { key: 'order', header: 'Ordem de exibição' },
    ];

    this.tableStore.setTable(columns, this.getMockRows());
  }

  ngOnInit(): void {
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar vídeo',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }

  private getMockRows(): TableRow[] {
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: 'Pregações',
      videoId: 'dfresdfrtg',
      featured: index === 0 ? 'Sim' : 'Não',
      order: index + 1,
      actions: [
        { key: `edit-${index}`, icon: 'edit', label: 'Editar vídeo' },
        { key: `delete-${index}`, icon: 'delete', label: 'Excluir vídeo' },
        { key: `open-${index}`, icon: 'chevron_right', label: 'Abrir vídeo' },
      ],
    }));
  }
}
