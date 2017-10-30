import { Component } from '@angular/core';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';

@Component({
  selector: 'document-sidebar',
  templateUrl: './document-sidebar.component.html',
  styleUrls: ['./document-sidebar.component.scss']
})
export class DocumentSidebarComponent {

  configuration = { placement : 'bottom-end' };

  constructor(
    private selectedService: SelectedDocumentService
  ) { }

  get documents() {
    return this.selectedService.getAllDocuments();
  }

}
