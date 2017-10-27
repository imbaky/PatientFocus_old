import { inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

import { DocumentService, UploadFile, UploadStatus, Document } from './document.service';
import { Label } from '../label/label.service';

const okResponse = { status: 200, statusText: 'OK' };

describe('Document Service', () => {

  let service: DocumentService;
  let http: HttpClient;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        HttpClient,
        DocumentService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = bed.get(DocumentService);
    http = bed.get(HttpClient);
  });

  it('GIVEN files 3 files THEN it should call uploadFile', () => {
    spyOn(service, 'uploadFile')
      .and.callThrough()
      .and.callFake(() => null);

    const files = [
      new File(['cheese'], 'file1.txt'),
      new File(['crust'], 'file2.txt'),
      new File(['tomato'], 'file3.txt'),
    ];
    service.uploadFiles(files);

    expect(service.uploadFile).toHaveBeenCalledTimes(3);
  });

  it('GIVEN a file to upload THEN it should queue a request and trigger an upload', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough()
      .and.callFake(() => null);

    const file = new File(['cheese'], 'file1.txt');
    service.uploadFile(file);

    expect(service.uploadState.queued.length).toBe(1);
    expect(service.triggerUpload).toHaveBeenCalled();
  });

  it('GIVEN a file in the queue and normal internet connection THEN it should trigger an upload normally', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough();

    spyOn(http, 'request').and.callFake(function () {
      return new Observable((observe) => {

        observe.next({
          type: HttpEventType.UploadProgress,
          loaded: 10,
          total: 100
        });

        expect(service.uploadState.current.item.status).toBe(UploadStatus.UPLOADING);

        observe.next(new HttpResponse<string>({
          body: 'kfc',
          status: 200
        }));

        expect(service.uploadState.completed.length).toBe(1);
        expect(service.triggerUpload).toHaveBeenCalledTimes(2);
      });
    });

    const file = new File(['cheese'], 'file1.txt');
    service.uploadFile(file);
  });

  it('GIVEN a file THEN queue a request and trigger an upload', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough();

    spyOn(http, 'request').and.callFake(function () {
      return new Observable((observe) => {

        observe.next({
          type: HttpEventType.Sent,
          loaded: 0,
          total: 100
        });

        observe.next({
          type: HttpEventType.UploadProgress,
          loaded: 10,
          total: 100
        });

        expect(service.uploadState.current.item.status).toBe(UploadStatus.UPLOADING);

        observe.next(new HttpResponse<string>({
          body: 'kfc',
          status: 500
        }));

        expect(service.uploadState.completed.length).toBe(1);
        expect(service.triggerUpload).toHaveBeenCalledTimes(2);

        observe.error('ERROR');
        observe.complete();

      });
    });

    const file = new File(['cheese'], 'file1.txt');
    service.uploadFile(file);
  });

  it('GIVEN a queued UploadFile THEN it should upload the file and trigger the next upload', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough();

    const uploadFile: UploadFile = {
      file: new File(['cheese'], 'file1.txt'),
      status: UploadStatus.QUEUING,
      request: new Observable((observe) => {

        expect(service.uploadState.queued.length).toBe(0);
        observe.next({ progress: 10, current: 10, total: 100 });

        expect(service.uploadState.current.item.status).toBe(UploadStatus.UPLOADING);
        observe.next(UploadStatus.DONE);

        expect(service.uploadState.completed.length).toBe(1);
        expect(service.uploadState.completed[0].status).toBe(UploadStatus.DONE);

        expect(service.triggerUpload).toHaveBeenCalledTimes(2);
        observe.complete();
      })
    };

    service.uploadState.queued.push(uploadFile);
    expect(service.uploadState.queued.length).toBe(1);

    service.triggerUpload();
  });

  it('GIVEN a failed uploaded file THEN it should try to reupload', () => {

    const uploadFile: UploadFile = {
      file: new File(['cheese'], 'file1.txt'),
      status: UploadStatus.ERROR,
      request: new Observable((observe) => {

        observe.next({ progress: 10, current: 10, total: 100 });

        expect(service.uploadState.current.item.status).toBe(UploadStatus.UPLOADING);
        observe.next(UploadStatus.DONE);

        expect(service.uploadState.completed.length).toBe(1);
        expect(service.uploadState.completed[0].status).toBe(UploadStatus.DONE);

        observe.complete();
      })
    };

    service.uploadState.completed.push(uploadFile);
    service.retryUploadFile(uploadFile);
  });

  it('GIVEN a completed uploaded file THEN it should try not to reupload', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough();

    const uploadFile: UploadFile = {
      file: new File(['cheese'], 'file1.txt'),
      status: UploadStatus.DONE,
      request: new Observable((observe) => {
        observe.complete();
      })
    };

    service.uploadState.completed.push(uploadFile);
    service.retryUploadFile(uploadFile);

    expect(service.triggerUpload).not.toHaveBeenCalled();
  });

  it('GIVEN an single document THEN it should successfully add labels',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {

    const documents: Array<Document> = [{
      id: 1,
      name: 'CTScan1',
      patientid: 123,
      description: 'Scan from Jewish General Hospital',
      url: 'testurl.com'
    }];

    const id = documents[0].id;

    const labels: Array<Label> = [
      {
        id: 1,
        name: 'JGH',
        color: 'Crimson'
      }
    ];

    service.addLabel(documents, labels)
      .subscribe((res: any) => {
        expect(res.status).toBe(true);
      });

    const req = httpMock.expectOne(`documents/${id}/labels/`);
    req.flush({ status: true }, okResponse);
    httpMock.verify();
  }));

});
