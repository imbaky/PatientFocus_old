import { Component } from '@angular/core';
import { Store } from '../../../../../../app/store';

import { SelectedPatientService } from '../../../../../patient/shared/services/selected-patient/selected-patient.service';
import { AuthService } from '../../../../../auth/shared/services/auth/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

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

  patients$ = this.http.get(`${environment.host_server}/patient`);

  links: Array<DashboardNavLink> = [
    { icon: '/assets/images/icons/user.svg', label: 'user', url: '/' },
    { icon: '/assets/images/icons/document.svg', label: 'Documents', url: '/document', isVisible: () => {
      return this.selectedPatientService.getSelectedPatientId() !== null;
    }}
  ];

  constructor(
    private http: HttpClient,
    private store: Store,
    private authService: AuthService,
    private selectedPatientService: SelectedPatientService
  ) {}

  get user$ () {
    return this.store.select('user');
  }

  get isDoctor() {
    return this.authService.payload.role === 'doctor';
  }

  get selectedPatient() {
    return this.selectedPatientService.getSelectedPatient();
  }

  select(patient) {
    this.selectedPatientService.setSelectedPatient(patient);
  }

}
