import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

/**
 * A wrapper to contain the file to be uploaded, the request promise and status.
 */
export interface UploadFile {
  file: File;
  request: Observable<any>;
  status: UploadStatus;
}

/**
 * Maintains the current state of the uploading progress
 * UploadState.completed - an array of completed UploadFile.
 * UploadState.current.state - upload progress
 * UploadState.current.item - the item UploadFile currently be processed
 * UploadState.queued - an array of queued UploadFile
 */
export interface UploadState {
  completed: Array<UploadFile>;
  current: { state: UploadProgress,  item: UploadFile };
  queued: Array<UploadFile>;
}

/**
 * Contains three properties to know the current state of the file being upload
 * UploadProgress.progress - percentage of the file upload
 * UploadProgress.current - the current number of bytes uploaded
 * UploadProgress.total - the total number of bytes to upload
 */
export interface UploadProgress  {
  progress: number;
  current: number;
  total: number;
}

/**
 * Upload statuses for UploadFile
 */
export enum UploadStatus {
  /**
   * is queueing
   */
  QUEUING,
  /**
   * is uploading
   */
  UPLOADING,
  /**
   *  is completed
   */
  DONE,
  /**
   *  has completed with an error
   */
  ERROR
}

@Injectable()
export class DocumentService {

  uploadState: UploadState = {
    completed: [],
    current: { state: null, item: null },
    queued: []
  };

  constructor(
    private http: HttpClient
  ) { }

  /**
   * An array of document files to be uploaded.
   * @param documents - Array of files
   */
  uploadFiles(documents: Array<File>) {
    documents.forEach(document => this.uploadFile(document));
  }

  /**
   * Adds a single document to a queue to be uploaded.
   * @param document - the document file
   */
  uploadFile(document: File) {
    const setup = new HttpRequest('POST', '/upload/file', document,
      { reportProgress: true });

    const request$ = new Observable<UploadProgress | UploadStatus>((observe) => {
      this.http.request(setup).subscribe((event: any) => {

        if (event.type === HttpEventType.UploadProgress) {

          observe.next({
            progress: Math.round(100 * (event.loaded / event.total)),
            current: event.loaded,
            total: event.total
          });

        } else if (event instanceof HttpResponse) {

          if (event.status === 200) {
            observe.next(UploadStatus.DONE);
          } else {
            observe.next(UploadStatus.ERROR);
          }
          observe.complete();
        }
      });
    });

    this.uploadState.queued
      .push({ request: request$, file: document, status: UploadStatus.QUEUING });

    this.triggerUpload();
  }

  /**
   * Trigger the queue to upload files.
   */
  triggerUpload() {
    if (this.uploadState.queued.length === 0 || this.uploadState.current.item !== null) {
      return;
    }

    this.uploadState.current.item = this.uploadState.queued.shift();
    this.uploadState.current.item.request.subscribe((progress) => {

      if (progress === UploadStatus.DONE || progress === UploadStatus.ERROR) {

        this.uploadState.current.item.status = progress;
        this.uploadState.completed.push(this.uploadState.current.item);

        this.uploadState.current.item = null;
        this.uploadState.current.state = null;

        this.triggerUpload();

      } else {

        this.uploadState.current.item.status = UploadStatus.UPLOADING;
        this.uploadState.current.state = progress;

      }
    });
  }

}
