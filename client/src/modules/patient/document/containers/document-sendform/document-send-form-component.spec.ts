import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '../../../../../app/store';
import { HttpClient } from '@angular/common/http';
import { SelectedPatientService } from '../../../shared/services/selected-patient/selected-patient.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShareDocumentService } from '../../../shared/services/share-document/share-document.service';
import { DocumentSendFormComponent } from './document-send-form.component';
import { FormGroupComponent } from '../../../../core/ui/forms/components/form-group/form-group.component';
import { ShortStringComponent } from '../../../../core/ui/forms/containers/forms/short-string/short-string.component';
import { Observable } from 'rxjs/Observable';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';
import { DebugElement } from '@angular/core';
import { ValidationMessageComponent } from '../../../../core/ui/forms/components/validation-message/validation-message.component';


class MockShareDocumentService {
  shareDocument(email: string, message: string, documents: Array<Document>) {
    return Observable.of({sucess: true});
  }
}

describe('Document Send Form Component', () => {

  let component: DocumentSendFormComponent;
  let fixture: ComponentFixture<DocumentSendFormComponent>;
  let service: ShareDocumentService;
  let el: DebugElement;
  let http: HttpClient;
  let store: Store;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        Store,
        HttpClient,
        {provide: ShareDocumentService, useClass: MockShareDocumentService},
        SelectedDocumentService,
        SelectedPatientService
      ],
      declarations: [
        FormGroupComponent,
        ShortStringComponent,
        DocumentSendFormComponent,
        ValidationMessageComponent
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ]
    });

    fixture = TestBed.createComponent(DocumentSendFormComponent);
    component = fixture.componentInstance;
    service = bed.get(SelectedPatientService);
    store = bed.get(Store);
    http = bed.get(HttpClient);
    el = fixture.debugElement;
    service = el.injector.get(ShareDocumentService);
  });

  it('GIVEN a valid email format THEN it should share the documents.', () => {
    spyOn(service, 'shareDocument').and.callThrough();
    component.form.patchValue({
      email: 'tsavadocs@tusslantis.ca',
      message: 'doctor please save my life'
    });

    component.onSubmit();
    expect(service.shareDocument).toHaveBeenCalled();
  });

  it('GIVEN an invalid email format THEN it should not share the documents.', () => {
    spyOn(service, 'shareDocument').and.callThrough();
    component.form.patchValue({
      email: 'emperorofthegalaxyisnotreal',
      message: ''
    });

    component.onSubmit();
    expect(service.shareDocument).toHaveBeenCalledTimes(0);
  });

});
