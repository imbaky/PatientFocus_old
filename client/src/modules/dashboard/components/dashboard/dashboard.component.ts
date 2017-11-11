import { Component } from '@angular/core';
import { Store } from '../../../../app/store';

import { SelectedPatientService } from '../../../patient/shared/services/selected-patient/selected-patient.service';
import { Patient, PatientService } from '../../../patient/shared/services/patient/patient.service';
import { AuthService, User } from '../../../auth/shared/services/auth/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export interface DashboardNavLink {
  icon: string;
  label: string;
  url: string;
  isVisible?: () => boolean;
}

@Component({
  selector: 'px-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  links: Array<DashboardNavLink> = [
    { icon: '/assets/images/icons/user.svg', label: 'user', url: '/' },
    { icon: '/assets/images/icons/document.svg', label: 'Documents', url: '/document', isVisible: () => {
      return this.authService.hasRole('patient') || this.selectedPatientService.hasSelectedPatient();
    }}
  ];

  constructor(
    private store: Store,
    private authService: AuthService,
    private patientService: PatientService,
    private selectedPatientService: SelectedPatientService
  ) {}

  /**
   * returns the user
   * @returns {Observable<User>}
   */
  get user$(): Observable<User> {
    return this.store.select<User>('user');
  }

  /**
   * Returns all the doctor's patients
   * @returns {Observable<Patient[]>}
   */
  get patients(): Observable<Patient[]> {
    return this.patientService.getAllPatients();
  }

  /**
   * Determines if a doctor is currently logged in.
   * @returns {boolean}
   */
  get isDoctor(): boolean {
    return this.authService.hasRole('doctor');
  }

  /**
   * Returns the selected patient
   * @returns {Patient}
   */
  get selectedPatient(): Patient {
    return this.selectedPatientService.getSelectedPatient();
  }

  /**
   * Selects the Patient
   * @param patient
   */
  select(patient) {
    this.selectedPatientService.setSelectedPatient(patient);
  }

}
