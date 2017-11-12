import { Component } from '@angular/core';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDocumentService } from '../../../shared/services/share-document/share-document.service';

@Component({
  selector: 'document-sendform',
  templateUrl: './document-send-form.component.html',
})
export class DocumentSendFormComponent {

  constructor(
    private selectedDocumentService: SelectedDocumentService,
    private fb: FormBuilder,
    private shareDocumentService: ShareDocumentService
  ) { }

  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required]],
    'message': ['', Validators.required ]
  });

  onSubmit() {
    this.shareDocumentService.shareDocument(this.form.value.email, this.form.value.message, this.documents)
      .subscribe();
  }

  get documents() {
    return this.selectedDocumentService.getAllDocuments();
  }

}
