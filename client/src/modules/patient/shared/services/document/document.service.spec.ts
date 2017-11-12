import { inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Observable } from 'rxjs/Observable';

import { DocumentService, UploadFile, UploadStatus, Document } from './document.service';
import { Label } from '../label/label.service';
import { Store } from '../../../../../app/store';
import { Patient } from '../patient/patient.service';

const okResponse = { status: 200, statusText: 'OK' };
const patient = { id: 1 } as Patient;

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
    service.uploadFiles(files, patient);

    expect(service.uploadFile).toHaveBeenCalledTimes(3);
  });

  it('GIVEN a file to upload THEN it should queue a request and trigger an upload', () => {
    spyOn(service, 'triggerUpload')
      .and.callThrough()
      .and.callFake(() => null);

    const file = new File(['cheese'], 'file1.txt');
    service.uploadFile(file, patient);

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
    service.uploadFile(file, patient);
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
    service.uploadFile(file, patient);
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

    const documents: Document[] = [{
      id: 1,
      size: 1,
      name: 'CTScan1',
      patient: 123,
      description: 'Scan from Jewish General Hospital',
      url: 'testurl.com',
      labels: [{
        id: 21,
        name: 'label21',
        color: 'greenyellow'
      }]
    }];

    const id = documents[0].id;

    const labels: Label[] = [{
      id: 21,
      name: 'label21',
      color: 'greenyellow'
    },
    {
      id: 22,
      name: 'label22',
      color: 'darkblue'
    }];

    service.addLabel(documents, labels)
      .subscribe((res: any) => {
        expect(res.status).toBe(true);
      });

    const req = httpMock.expectOne(`/document/labels`);
    req.flush({ status: true }, okResponse);
    httpMock.verify();
  }));

  it('GIVEN a patient session THEN it should fetch the documents',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {

    const documents: Document[] = [{
      id: 1,
      size: 1,
      name: 'CTScan1',
      patient: 123,
      description: 'Scan from Jewish General Hospital',
      url: 'testurl.com',
      labels: [{
        id: 21,
        name: 'label21',
        color: 'greenyellow'
      }]
    }];

    service.getDocuments({id: 1} as Patient)
      .subscribe((res: any) => {
        expect(documents[0].name).toBe('CTScan1');
        expect(documents.length).toBe(1);
      });

    const req = httpMock.expectOne(`/document?patient=1`);
    req.flush(documents, okResponse);

    httpMock.verify();
  }));

});
