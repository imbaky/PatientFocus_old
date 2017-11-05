import { Component } from '@angular/core';

// services
import { DocumentService, UploadFile, UploadState, UploadStatus } from '../../../patient/shared/services/document/document.service';

@Component({
  selector: 'px-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss']
})
export class UploadProgressComponent {

  constructor(
    private documentService: DocumentService
  ) { }

  get uploadState(): UploadState {
    return this.documentService.uploadState;
  }

  get completedUploads(): Array<UploadFile> {
    return this.uploadState.completed;
  }

  get queuedUploads(): Array<UploadFile> {
    return this.uploadState.queued;
  }

  getTotalUploads (): number {
    return ((this.uploadState.current.item) ? 1 : 0) +
      this.completedUploads.length +
      this.uploadState.queued.length;
  }

  getTotalSuccessUploads() {
    return this.completedUploads.filter((item) => item.status === UploadStatus.DONE).length;
  }

  retryUpload(upload: UploadFile) {
    this.documentService.retryUploadFile(upload);
  }

}
