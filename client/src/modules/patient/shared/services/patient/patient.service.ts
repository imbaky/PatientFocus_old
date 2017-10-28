import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '../../../../../app/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

export interface Patient {
  id: number,
  pfuser: number;
  race: string;
  gender: string;
  dob: string;
  language: string;
  smoke: boolean;
  problem_list?: string;
  meds_list?: Array<string>;
  allergy_list?: Array<string>;
  date_created?: string;
  date_modified?: string;
}

@Injectable()
export class PatientService {

  patient: Patient;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getPatient(id: number) {
    return this.http.get(`/patient/${id}`)
      .do((res: any) => {
        if ( res.patient) {
          this.store.set('patient',  res.patient);
          this.patient =  res.patient;
        }
      })
      .catch(err => Observable.throw(err));
  }

}
