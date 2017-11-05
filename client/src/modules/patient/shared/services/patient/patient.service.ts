import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Store } from '../../../../../app/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

import { environment } from '../../../../../environments/environment';
import { User } from '../../../../auth/shared/services/auth/auth.service';

export interface Patient {
  id: number;
  user: User | number;
  race: string;
  gender: string;
  date_of_birth: string;
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

  /**
   * Get a patient by id
   * @param {number} id
   * @returns {Observable<Patient>}
   */
  getPatient(id: number): Observable<Patient> {
    return this.http.get(`${environment.host_server}/patient/${id}`)
      .do((patient: Patient) => {
        if (patient) {
          this.store.set('patient', patient);
          this.patient =  patient;
        }
      })
      .catch(err => Observable.throw(err));
  }

  /**
   * Get all patients
   * @returns {Observable<Patient[]>}
   */
  getAllPatients(): Observable<Patient[]> {
    return this.http.get(`${environment.host_server}/patient`)
      .catch(err => Observable.throw(err));
  }

}
