import { Component, HostListener, Input, OnDestroy } from '@angular/core';

import { Document } from '../../../shared/services/document/document.service';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';

@Component({
  selector: 'document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['document-list.component.scss']
})
export class DocumentListComponent implements OnDestroy {

  @Input()
  documents: Document[];

  // The last selected document for shift selection.
  lastSelected: Document;

  @HostListener('document:click', ['$event'])
  documentClick($event) {
    if (!$event.target.closest('document-item')) {
      this.selectedService.clearAllDocuments();
    }
  }

  constructor(
    private selectedService: SelectedDocumentService
  ) { }

  ngOnDestroy() {
    this.selectedService.clearAllDocuments();
  }

  select($event: MouseEvent, document: Document) {
    if ($event.metaKey) {
      this.toggleSelection(document);
    } else if ($event.shiftKey) {
      if (this.lastSelected && this.lastSelected !== document) {
        let start = this.documents.indexOf(this.lastSelected);
        let end = this.documents.indexOf(document);
        if (start > end) {
          const temp = start;
          start = end;
          end = temp;
        }
        for (let i = start; i <= end; i++) {
          this.selectedService.addDocument(this.documents[i]);
        }
      }
    } else {
      this.selectedService.clearAllDocuments();
      this.toggleSelection(document);
    }
  }

  toggleSelection(document: Document) {
    if (this.selectedService.isSelected(document)) {
      this.selectedService.removeDocument(document);
    } else {
      this.lastSelected = document;
      this.selectedService.addDocument(document);
    }
  }

}
