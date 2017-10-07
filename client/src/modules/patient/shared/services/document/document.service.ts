import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface Document {
  name: string,
  url: string,
  created_at: string | number
}

@Injectable()
export class DocumentService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Uploads documents to the server.
   * @param documents
   * @returns {Observable<Object>}
   */
  uploadDocuments(documents: Array<File>): Observable<Array<Document>> {
    const form = new FormData();

    documents.forEach((document) =>
      form.append('document[]', document, document.name));

    return this.http.post('somewhere', documents);
  }

}
