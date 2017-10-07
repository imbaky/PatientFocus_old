import { TestBed } from '@angular/core/testing';
import { Http, ResponseOptions, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

// service
import { DocumentService, Document } from './document.service';
import { HttpClient } from '@angular/common/http';

export function createResponse(body) {
  return Observable.of(body);
}

export class MockHttpClient {
  post() {
    return createResponse({});
  }
}

const successMessage = { status: true };

describe('Document Service', () => {
  let service: DocumentService;
  let http: Http;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        DocumentService,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    });
    http = bed.get(HttpClient);
    service = bed.get(DocumentService);
  });

  it('GIVEN an array of files it should call the http client post method', () => {
    const files = [
      new File(['awesome'], 'anhkhoi.jpg'),
      new File(['fantastic'], 'laurendy.jpg')
    ];
    const response: Array<Document> = [
      { name: 'anhkhoi.jpg', url: 'anhkhoi.jpg', created_at: 343546 },
      { name: 'laurendy.jpg', url: 'laurendy.jpg', created_at: 343547 }
    ];

    spyOn(http, 'post').and.returnValue(createResponse([...response]));

    service.uploadDocuments(files)
      .subscribe((documents: Array<Document>) => {
        expect(documents.length).toBe(2);
      });
  });

});
