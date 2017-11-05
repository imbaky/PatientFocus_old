import { Component } from '@angular/core';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';

@Component({
  selector: 'document-sidebar',
  templateUrl: './document-sidebar.component.html',
  styleUrls: ['./document-sidebar.component.scss']
})
export class DocumentSidebarComponent {

  popperConfiguration = { placement : 'bottom-end' };

  constructor(
    private selectedDocumentService: SelectedDocumentService
  ) { }

  /**
   * Returns all selected documents for the sidebar
   * @returns {Array<Document>}
   */
  get documents() {
    return this.selectedDocumentService.getAllDocuments();
  }

}
