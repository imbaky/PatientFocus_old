import { inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShareDocumentService } from './share-document.service';
import { Document } from '../document/document.service';

const okResponse = { status: 200, statusText: 'OK' };
const badResponse = { status: 400, statusText: 'BAD REQUEST ' };

describe('Share Document Service', () => {
  let service: ShareDocumentService;
  let http: HttpClient;

  const documents: Document[] = [
    {
      id: 1,
      name: 'Doc 1',
      size: 1,
      patient: 1111,
      url: 'www.patientfocus.com',
      labels: [
        {
          id: 1,
          name: 'label',
          color: 'YellowGreen'
        }
      ],
      description: 'This is my first document'
    },
    {
      id: 2,
      name: 'Doc 2',
      size: 1,
      patient: 1112,
      url: 'www.patientfocus.com',
      description: 'This is my second document',
      labels: [
        {
          id: 2,
          name: 'label2',
          color: 'DarkSlateGray'
        }
      ]
    }
  ];

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        ShareDocumentService,
        HttpClient
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    http = bed.get(HttpClient);
    service = bed.get(ShareDocumentService);
  });

  it('GIVEN a recipient email and message THEN documents should be shared',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const email: String = 'anthonyrobert@medoku.com';
      const message: String = 'Here is my CT scan';

      service.shareDocument(email, message, documents).subscribe();
      const req = httpMock.expectOne({
        url: '/document/share',
        method: 'POST'
      });
      req.flush({ status: true }, okResponse);

      httpMock.verify();
    }));
});
