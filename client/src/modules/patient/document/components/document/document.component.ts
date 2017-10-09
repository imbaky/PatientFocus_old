import { Component } from '@angular/core';

import { DocumentService } from '../../../shared/services/document/document.service';

@Component({
  'selector': 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {

  constructor(
    private documentService: DocumentService
  ) { }

  get progress() {
    return this.documentService.uploadState;
  }

  upload($event) {
    const files = $event.target.files as FileList;

    const upload = [];
    for (let i = 0; i < files.length; i++) {
      upload.push(files.item(i));
    }

    this.documentService.uploadFiles(upload);
  }
}
