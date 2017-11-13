import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/pluck';

import { Label } from '../label/label.service';
import { Patient } from '../patient/patient.service';

import { environment } from '../../../../../environments/environment';
import { User } from '../../../../auth/shared/services/auth/auth.service';

/**
 * A wrapper to contain the file to be uploaded, the request promise and status.
 */
export interface UploadFile {
  file: File;
  request: Observable<any>;
  status: UploadStatus;
  onSuccess?: Function;
  onError?: Function;
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

export interface Document {
  id: number;
  name: string;
  size: number;
  labels?: Label[];
  patient?: Patient | number;
  last_modified_by?: User | number;
  url?: string;
  description?: string;
}

export declare type Documents = Document[];

/**
 * Upload statuses for UploadFile
 */
export enum UploadStatus {
  /**
   * is queueing
   */
  QUEUING,
  /**
   * is pending to upload
   */
  PENDING,
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
   * @param patient - The patient
   */
  uploadFiles(documents: Array<File>, patient: Patient, onSuccess?: Function, onError?: Function) {
    documents.forEach(document => this.uploadFile(document, patient, onSuccess, onError));
  }

  /**
   * Adds a single document to a queue to be uploaded.
   * @param document - the document file
   * @param patient - The patient
   */
  uploadFile(document: File, patient: Patient, onSuccess?: Function, onError?: Function) {
    const form = new FormData();

    form.append('file', document);
    form.append('patient', patient.id + '');

    const setup = new HttpRequest('POST', `${environment.host_server}/document/upload`, form, {
      reportProgress: true
    });

    const request$ = this.http.request(setup)
      // Filter through the response and return only simple types such as
      // the upload status or an upload progress object
      .map((event: any) => {

        // If the event is of upload progress then return the progress
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return {
            progress: Math.round(100 * (event.loaded / event.total)),
            current: event.loaded,
            total: event.total
          };
        }

        // If and only if the upload is complete with a 200 code then respond
        // with am upload status code done.
        if (event instanceof HttpResponse && event.status === 200) {
          return UploadStatus.DONE;
        }

        // Catch any other type of responses
        if (event instanceof HttpResponse) {
          return UploadStatus.ERROR;
        }

        // If there are other types of status codes then return ERROR
        return UploadStatus.PENDING;
      })
      // Catch any other types of the exceptions and return them into the good stream
      .catch((err) => Observable.of(UploadStatus.ERROR));

    // Push for queue
    this.uploadState.queued
      .push({
        request: request$,
        file: document,
        status: UploadStatus.QUEUING,
        onSuccess: onSuccess,
        onError: onSuccess
      });

    this.triggerUpload();
  }

  /**
   * Trigger the queue to upload files.
   */
  triggerUpload() {
    const current = this.uploadState.current;

    // if there are no queued upload files or there is a current item being processed, get out.
    if (this.uploadState.queued.length === 0 || current.item !== null) {
      return;
    }

    // Shift the first item in the array to be processed
    current.item = this.uploadState.queued.shift();

    // Subscribe to the request and try to upload
    current.item.request.subscribe((progress) => {

      // There is a possibility that the subscription may stream many times and in case the progress
      // is completed and this code is executed again we can avoid the undefined error.
      if (!current.item) {
        return;
      }

      // Depending on future decisions, should we always continue to upload files
      // if files fail to upload?
      if (progress === UploadStatus.DONE || progress === UploadStatus.ERROR) {

        current.item.status = progress;

        // trigger callbacks for errors and successes
        if (UploadStatus.DONE && current.item.onSuccess) {
          current.item.onSuccess();
        }

        if (UploadStatus.ERROR && current.item.onError) {
          current.item.onError();
        }

        this.uploadState.completed.push(current.item);

        // Reset the current state
        current.item = null;
        current.state = null;

        // Continue upload for the items in the queue
        this.triggerUpload();

      } else if (typeof progress === 'object') {

        // Continue upload
        current.item.status = UploadStatus.UPLOADING;
        current.state = progress;
      }
    });
  }

  /**
   * A failed upload can be retried.
   * @param file
   */
  retryUploadFile(file: UploadFile) {
    // if the upload is not of state ERROR, do not process the request
    if (file.status !== UploadStatus.ERROR) {
      return;
    }

    const completed = this.uploadState.completed;

    for (let i = completed.length; i--; ) {
      // Find the node that equals to the file variable and put it back into the queue
      if (completed[i] === file) {
        this.uploadState.queued.unshift(completed.splice(i, 1)[0]);
        break;
      }
    }

    this.triggerUpload();
  }

  /**
   * Gets all documents of the patient.
   * @returns {Observable<R|T>}
   */
  getDocuments(patient: Patient): Observable<Documents> {
    return this.http.get(`${environment.host_server}/document/${patient.id}`)
      .pluck('documents')
      .catch((err) => Observable.throw(err));
  }

  /**
   * Adds selected labels to a list of documents
   * // documents/{document-id}/labels/
   * @param documents - the list of documents
   * @param labels - the list of labels to add
   */
  addLabel(documents: Array<Document>, labels: Array<Label>): Observable<any> {
    const id = documents[0].id;
    const labelIds = labels.map((label) => {
      return label.id;
    });

    return this.http.post(`${environment.host_server}/document/labels`, {
      documentid: id,
      labels: labelIds
    });
  }

}
