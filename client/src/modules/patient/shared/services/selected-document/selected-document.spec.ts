import { Document } from '../document/document.service';
import { SelectedDocumentService } from './selected-document.service';
import { TestBed } from '@angular/core/testing';

describe('Selected Document Service', () => {

  let service;

  const documents: Array<Document> = [
    {
      id: 1,
      name: 'Doc 1',
      patientid: '1111',
      url: 'www.patientfocus.com',
      description:
        'This is my first document'
    },
    {
      id: 2,
      name: 'Doc 2',
      patientid: '1112',
      url: 'www.patientfocus.com',
      description:
        'This is my second document'
    }
  ];

  const document: Document = {
    id: 3,
    name: 'Doc 3',
    patientid: '12',
    url: 'www.patientfocus.com',
    description:
      'This is my third document'
  };

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        SelectedDocumentService
      ],
    });
    service = bed.get(SelectedDocumentService);
    service.documents = [...documents];
  });


  it('GIVEN existing documents THEN it should get all documents', () => {
    expect(service.getAllDocuments().length).toBe(2);
  });

  it('GIVEN a document THEN it should be able to add it to documents', () => {
    service.addDocument(document);
    expect(service.getAllDocuments().length).toBe(3);
  });

  it('GIVEN an existing document THEN it should be able to delete it ', () => {
    service.addDocument(document);
    service.removeDocument(document);
    expect(service.getAllDocuments().length).toBe(2);
  });

  it('SHOULD be able to clear all documents', () => {
    service.clearAllDocuments();
    expect(service.getAllDocuments().length).toBe(0);
  });

  it('GIVEN a document THEN we should know if it is selected', () => {
    service.addDocument(document);
    expect(service.isSelected(document)).toBeTruthy();
  });

});
