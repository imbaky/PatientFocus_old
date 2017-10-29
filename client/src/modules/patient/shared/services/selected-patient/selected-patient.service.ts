import { Injectable } from '@angular/core';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Patient } from '../patient/patient.service';

@Injectable()
export class SelectedPatientService {

  private patient: Patient = null;

  constructor(
    private authService: AuthService
  ) { }

  getSelectedPatientId(): number {
    if (this.authService.payload.role  === 'patient') {
      return this.authService.payload.role_id;
    }
    return this.patient ? this.patient.id : null;
  }

  getSelectedPatient(): Patient {
    return this.patient;
  }

  setSelectedPatient(patient: Patient): void {
    this.patient = patient;
  }

}
