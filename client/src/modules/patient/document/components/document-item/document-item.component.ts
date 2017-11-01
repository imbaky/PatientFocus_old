import { Component, Input } from '@angular/core';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';

@Component({
  selector: 'document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.scss']
})
export class DocumentItemComponent {

  @Input()
  document;

  constructor(
    private selectedService: SelectedDocumentService
  ) { }

  get isSelected() {
    return this.selectedService.isSelected(this.document);
  }

}
