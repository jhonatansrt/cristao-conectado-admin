import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { TableColumn, TableRow, TableStore } from '../../application/table/table-store';
import { HeaderStore } from '../../application/header/header-store';
import { VideosService } from '../../application/videos/videos-service';
import { Container } from '../../util/container.service';
import { AddVideoModal } from './add-video-modal/add-video-modal';
import { TableComponent } from '../common/table/table.component';
import { EmptyCaseComponent } from '../common/empty-case/empty-case.component';
import { AlertService } from '../common/alert/alert.service';

@Component({
  selector: 'app-videos',
  imports: [TableComponent, EmptyCaseComponent],
  templateUrl: './videos.html',
  styleUrl: './videos.scss',
})
export class Videos implements OnInit, OnDestroy {
  private readonly tableStore = inject(TableStore<TableRow>);
  private readonly headerStore = inject(HeaderStore);
  private readonly videosService = inject(VideosService);
  private readonly container = inject(Container);
  private readonly alertService = inject(AlertService);

  protected readonly isLoading = this.tableStore.isLoading();

  constructor() {
    const columns: TableColumn[] = [
      { key: 'title', header: 'Título' },
      { key: 'videoId', header: 'ID do vídeo' },
      { key: 'featured', header: 'Destaque' },
      { key: 'order', header: 'Ordem de exibição' },
    ];

    this.tableStore.setTable(columns, []);
  }

  ngOnInit(): void {
    this.headerStore.setButtonsActions([
      {
        btnClass: 'btn-primary',
        label: 'Adicionar vídeo',
        onClick: this.handleAddVideo,
      },
    ]);

    this.getVideos();
  }

  ngOnDestroy(): void {
    this.headerStore.clearButtonsActions();
  }


  private readonly handleAddVideo = (): void => {
    const componentRef = this.container.vcr?.createComponent(AddVideoModal);
    componentRef?.instance.videoCreated.subscribe(() => this.getVideos());
  };

  private getVideos(): void {
    this.tableStore.setLoading(true);

    this.videosService
      .getVideos()
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe((rows) => {
        this.tableStore.setRows(
          rows.map((row) => ({
            ...row,
            actions: row.actions?.map((action) => {
              if (action.key.includes('delete')) {
                return {
                  ...action,
                  onClick: () => this.handleDeleteVideo(String(row.id)),
                };
              }

              return action;
            }),
          })),
        );
      });
  }

  private async handleDeleteVideo(videoId: string): Promise<void> {
    const confirmed = await this.alertService.openAlert({
      message: 'Tem certeza que deseja excluir o vídeo?',
    });

    if (!confirmed) {
      return;
    }

    this.tableStore.setLoading(true);

    this.videosService
      .deleteVideo({ id: videoId })
      .pipe(finalize(() => this.tableStore.setLoading(false)))
      .subscribe(() => this.getVideos());
  }

  protected hasVideos(): boolean {
    return this.tableStore.hasRows();
  }
}
