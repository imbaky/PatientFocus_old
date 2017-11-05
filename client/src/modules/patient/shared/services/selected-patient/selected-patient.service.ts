import { Injectable } from '@angular/core';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Patient } from '../patient/patient.service';

@Injectable()
export class SelectedPatientService {

  private patient: Patient;

  /**
   * Returns the selected Patient
   * @returns {Patient}
   */
  getSelectedPatient(): Patient {
    return this.patient;
  }

  /**
   * Return true if there is a selected patient
   * @returns {boolean}
   */
  hasSelectedPatient(): boolean {
    return !!(this.patient);
  }

  /**
   * Returns the selected patient
   * @param patient
   */
  setSelectedPatient(patient: Patient): void {
    this.patient = patient;
  }

  /**
   * Clears the selected patient.
   */
  clearSelectedPatient(): void {
    this.patient = null;
  }

}
