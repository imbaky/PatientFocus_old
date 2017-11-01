import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {
  Documents,
  DocumentService, UploadFile, UploadState,
  UploadStatus
} from '../../../shared/services/document/document.service';

import { Store } from '../../../../../app/store';
import { Patient } from '../../../shared/services/patient/patient.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

@Component({
  'selector': 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  @ViewChild('fileInput')
  fileInput: ElementRef;

  UploadStatus = UploadStatus;

  documents$: Observable<Documents>;

  constructor(
    private store: Store,
    private documentService: DocumentService
  ) { }

  ngOnInit() {
    this.documents$ = this.store.select('patient')
      .mergeMap((patient: Patient) => this.documentService.getDocuments(patient));
  }

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

  openFileBrowser() {
    this.fileInput.nativeElement.click();
  }

}
