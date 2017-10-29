import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Patient, PatientService } from '../patient/patient.service';
import { SelectedPatientService } from '../selected-patient/selected-patient.service';

@Injectable()
export class PatientResolver implements Resolve<Patient> {

  constructor(
    private patientService: PatientService,
    private selectedPatient: SelectedPatientService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Patient> {
    return this.patientService.getPatient(this.selectedPatient.getSelectedPatientId());
  }

}
