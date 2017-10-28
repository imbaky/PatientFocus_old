import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Patient, PatientService } from '../patient/patient.service';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

@Injectable()
export class PatientResolver implements Resolve<Patient> {

  constructor(
    private patientService: PatientService,
    private authService: AuthService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Patient> {
    return this.patientService.getPatient(this.authService.payload.patient_id);
  }

}
