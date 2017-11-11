import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../environments/environment';

import { Document } from '../document/document.service';

@Injectable()
export class ShareDocumentService {

  constructor(
    private http: HttpClient
  ) {}

  /**
   * Shares documents to doctor
   * @param email - the recipient's email
   * @param message - the message to accompany the documents
   * @param documents - the list of documents
   */
  shareDocument(email: String, message: String, documents: Array<Document>): Observable<any> {
    const documentIds = documents.map(document => document.id);
    return this.http.post(`${environment.host_server}/document/share`, {
      email: email,
      message: message,
      documents: documentIds
    })
    .catch((err) => Observable.throw(err));
  }
}
