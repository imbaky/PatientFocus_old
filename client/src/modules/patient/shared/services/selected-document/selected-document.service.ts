import { Injectable } from '@angular/core';
import { Document } from '../document/document.service';

@Injectable()
export class SelectedDocumentService {

  /**
   * List of documents
   */
  documents: Array<Document> = [];

  /**
   * Retrieve all documents
   * @returns {Array<Documents>}
   */
  getAllDocuments(): Array<Document> {
    return this.documents;
  }

  /**
   * Add a document to existing documents
   * @param {Document} document
   */
  addDocument(document: Document) {
    if (this.documents.indexOf(document) === -1) {
      this.documents.push(document);
    }
  }

  /**
   * Removes an existing document
   * @param {Document} document
   */
  removeDocument(document: Document) {
    const index = this.documents.indexOf(document);
    this.documents.splice(index, 1);
  }

  /**
   * Clears all selected documents.
   */
  clearAllDocuments() {
    this.documents = [];
  }

  /**
   * Checks if document already exists
   * @param {Document} document
   * @returns {boolean}
   */
  isSelected(document: Document): boolean {
    return (this.documents.indexOf(document) !== -1);
  }

}
