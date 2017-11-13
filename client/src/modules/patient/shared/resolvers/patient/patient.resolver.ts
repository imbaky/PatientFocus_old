import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

// services
import { Patient, PatientService } from '../../services/patient/patient.service';
import { SelectedPatientService } from '../../services/selected-patient/selected-patient.service';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

@Injectable()
export class PatientResolver implements Resolve<Patient> {

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private selectedPatient: SelectedPatientService
  ) { }

  resolve(): Observable<Patient> {
    if (this.authService.hasRole('patient')) {
      return this.patientService.getPatient(this.authService.getRole().id);
    }
    return this.patientService.getPatient(this.selectedPatient.getSelectedPatient().id);
  }

}
