import { inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Store } from '../../../../../app/store';

import { DocumentService } from '../../../shared/services/document/document.service';
import { LabelService, Label } from '../../../shared/services/label/label.service';
import { SelectedDocumentService } from '../../../shared/services/selected-document/selected-document.service';
import { PipeModule } from '../../../../core/pipe/pipe.module';

import { LabelsComponent } from '../labels/labels.component';
import { DocumentLabelComponent } from '../../components/document-label/document-label.component';

const okResponse = { status: 200, statusText: 'OK' };

describe('Document Labels Container', () => {

  let documentService: DocumentService;
  let labelService: LabelService;
  let fixture;
  const labels: Label[] = [
    {
      id: 1,
      name: 'Good',
      color: '#ff00ff'
    },
    {
      id: 2,
      name: 'Bad',
      color: '#00ff00'
    },
    {
      id: 3,
      name: 'Great',
      color: '#0000ff'
    },
    {
      id: 4,
      name: 'Excellent',
      color: '#000000'
    },
    {
      id: 5,
      name: 'Very Bad',
      color: '#ffffff'
    }
  ];

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      declarations: [
        LabelsComponent,
        DocumentLabelComponent
      ],
      providers: [
        Store,
        DocumentService,
        LabelService,
        SelectedDocumentService,
        HttpClient
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        PipeModule,
      ]
    });

    fixture = TestBed.createComponent(LabelsComponent);
    labelService = testBed.get(LabelService);
    documentService = testBed.get(DocumentService);
  });

  it('GIVEN a specific label name, THEN we should see all matching labels',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.labels--form-control')).nativeElement;
    const req = httpMock.expectOne({
      url: '/label',
      method: 'GET'
    });
    req.flush({labels}, okResponse);
    httpMock.verify();

    fixture.detectChanges();
    input.value = 'Bad';
    input.dispatchEvent(new Event('input'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const documentItemComponents = fixture.debugElement.queryAll(By.css('.labels--item'));
      expect(documentItemComponents.length).toBe(2);
    });
  }));

  it('GIVEN no label name, THEN we should see all existing labels',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.labels--form-control')).nativeElement;
    const req = httpMock.expectOne({
      url: '/label',
      method: 'GET'
    });
    req.flush({labels}, okResponse);
    httpMock.verify();

    fixture.detectChanges();
    input.value = '';
    input.dispatchEvent(new Event('input'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const documentItemComponents = fixture.debugElement.queryAll(By.css('.labels--item'));
      expect(documentItemComponents.length).toBe(labels.length);
    });
  }));

  it('GIVEN a name and a color AND creating a label, THEN we should see the new label in the list',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    spyOn(labelService, 'createLabel');
    const btn = fixture.debugElement.query(By.css('.labels--action-btn')).nativeElement;
    const input = fixture.debugElement.query(By.css('.labels--form-control')).nativeElement;
    const color = fixture.debugElement.query(By.css('.labels--action-colorPicker')).nativeElement;

    fixture.detectChanges();
    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    const req = httpMock.expectOne({
      url: '/label',
      method: 'GET'
    });
    req.flush({labels}, okResponse);
    httpMock.verify();

    fixture.detectChanges();
    btn.dispatchEvent(new Event('click'));

    fixture.whenStable().then(() => {
      expect(labelService.createLabel).toHaveBeenCalledTimes(1);
      expect(labelService.createLabel).toHaveBeenCalledWith({ name: input.value, color: color.value });
    });
  }));

  it('GIVEN an existing label, THEN clicking on it should add it to a document',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    fixture.detectChanges();
    spyOn(documentService, 'addLabel');
    const documentLabels = fixture.debugElement.queryAll(By.css('.labels--item'));
    const input = fixture.debugElement.query(By.css('.labels--form-control')).nativeElement;
    const req = httpMock.expectOne({
      url: '/label',
      method: 'GET'
    });
    req.flush({labels}, okResponse);
    httpMock.verify();

    fixture.detectChanges();
    input.value = '';
    input.dispatchEvent(new Event('input'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const documentItemComponent = fixture.debugElement.queryAll(By.css('.labels--item'))[0].nativeElement;
      fixture.detectChanges();
      documentItemComponent.dispatchEvent(new Event('click'));
      expect(documentService.addLabel).toHaveBeenCalledTimes(1);
      expect(documentService.addLabel).toHaveBeenCalledWith([], [labels[0]]);
    });
  }));

});
