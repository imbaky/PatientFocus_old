import { Component } from '@angular/core';

import {
  DocumentService, UploadFile, UploadState,
  UploadStatus
} from '../../../shared/services/document/document.service';

@Component({
  'selector': 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {

  UploadStatus = UploadStatus;

  constructor(
    private documentService: DocumentService
  ) { }

  get progress(): UploadState {
    return this.documentService.uploadState;
  }

  onRetryUpload(file: UploadFile) {
    this.documentService.retryUploadFile(file);
  }

  onUpload($event) {
    const files = $event.target.files as FileList;

    const upload = [];
    for (let i = 0; i < files.length; i++) {
      upload.push(files.item(i));
    }

    this.documentService.uploadFiles(upload);
  }
}
