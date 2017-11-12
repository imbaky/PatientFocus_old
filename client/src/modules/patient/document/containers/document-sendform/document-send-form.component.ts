import { Component } from '@angular/core';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShareDocumentService } from '../../../shared/services/share-document/share-document.service';
import { Document } from '../../../shared/services/document/document.service';


@Component({
  selector: 'document-sendform',
  templateUrl: './document-send-form.component.html',
})
export class DocumentSendFormComponent {

  constructor(private selectedDocumentService: SelectedDocumentService,
              private fb: FormBuilder,
              private shareDocumentService: ShareDocumentService) {
  }

  /**
   * Document send form
   * @type {FormGroup}
   */
  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'message': ['']
  });

  errors = null;

  /**
   * Shares the documents when form is valid
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.shareDocumentService.shareDocument(this.form.value.email, this.form.value.message, this.documents)
        .subscribe();
    } else {
      this.form.get('email').markAsTouched();
      this.form.get('email').updateValueAndValidity();
    }
  }

  /**
   * Retrieve all documents user has currently selected
   * @returns {Array<Document>}
   */
  get documents(): Array<Document> {
    return this.selectedDocumentService.getAllDocuments();
  }

}
