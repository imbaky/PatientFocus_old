import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Patient, PatientService } from './patient.service';
import { Store } from '../../../../../app/store';

const okResponse = { status: 200, statusText: 'OK' };

describe('Document Service', () => {

  let patient: Patient;
  let patients: Patient[];
  let service: PatientService;
  let http: HttpClient;
  let store: Store;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        Store,
        HttpClient,
        PatientService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = bed.get(PatientService);
    store = bed.get(Store);
    http = bed.get(HttpClient);
    patient = {
      id: 1,
      user: 1,
      race: 'Canadian',
      gender: 'male',
      date_of_birth: '1996/08/19',
      language: 'en_US',
      smoke: false
    };
  });

  patients = [
    {
      id: 1,
      user: 1,
      race: 'Canadian',
      gender: 'male',
      date_of_birth: '1996/08/19',
      language: 'en_US',
      smoke: false
    },
    {
      id: 2,
      user: 2,
      race: 'Russian',
      gender: 'male',
      date_of_birth: '1946/08/19',
      language: 'en_US',
      smoke: false
    },
    {
      id: 3,
      user: 3,
      race: 'Nigerian',
      gender: 'male',
      date_of_birth: '1969/09/11',
      language: 'en_US',
      smoke: false
    },
  ];

  it('GIVEN a patient id THEN the patient is returned.', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    spyOn(store, 'set');
    service.getPatient(1)
      .subscribe((res: any) => {
        expect(res.race).toBe('Canadian');
      });

    const req = httpMock.expectOne({
      url: '/patient/1',
      method: 'GET'
    });

    req.flush({ status: true , patient: patient }, okResponse);
    expect(store.set).toHaveBeenCalled();
  }));

  it('SHOULD get all patients', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    service.getAllPatients()
      .subscribe((res: any) => {
        expect(res.patients.length).toBe(3);
        expect(res.patients[2].race).toBe('Nigerian');
      });
    const req = httpMock.expectOne( {
      url: '/patient',
      method: 'GET'
    });

    req.flush({ status: true , patients: patients }, okResponse);
  }));

});
