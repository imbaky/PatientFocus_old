import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Patient, PatientService } from './patient.service';
import { Store } from '../../../../../app/store';

const okResponse = { status: 200, statusText: 'OK' };

describe('Document Service', () => {

  let patient: Patient;
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
      pfuser: 1,
      race: 'Canadian',
      gender: 'male',
      dob: '1996/08/19',
      language: 'en_US',
      smoke: false
    }
  });

  it('GIVEN a patient id THEN the patient is returned.', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    spyOn(store, 'set');
    service.getPatient(1)
      .subscribe((res: any) => {
        expect(res.patient.race).toBe('Canadian');
      });

    const req = httpMock.expectOne({
      url: '/patient/1',
      method: 'GET'
    });

    req.flush({ status: true , patient: patient }, okResponse);
    expect(store.set).toHaveBeenCalled();
  }));

});
