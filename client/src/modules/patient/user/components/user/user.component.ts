import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Patient } from '../../../shared/services/patient/patient.service';
import { SelectedPatientService } from '../../../shared/services/selected-patient/selected-patient.service';

@Component({
  selector: 'user',
  styleUrls: ['./user.component.scss'],
  templateUrl: './user.component.html'
})
export class UserComponent {

  constructor(

  ) { }

  ngOnInit() {

  }

  select(patient: Patient) {

  }

}
