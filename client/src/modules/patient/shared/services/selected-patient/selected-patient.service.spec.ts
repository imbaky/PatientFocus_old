import { TestBed } from '@angular/core/testing';
import { SelectedPatientService } from './selected-patient.service';
import { Patient } from '../patient/patient.service';

describe('Selected Patient Service', () => {

  let service: SelectedPatientService;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        SelectedPatientService
      ],
    });
    service = bed.get(SelectedPatientService);
  });

  it('GIVEN a patient THEN it should set a patient', () => {
    const patient = {id: 1} as Patient;

    service.setSelectedPatient(patient);
    expect(service.hasSelectedPatient()).toBe(true);
  });

  it('GIVEN a patient THEN should get return the same selected patient',  () => {
    const patient = {id: 1} as Patient;

    service.setSelectedPatient(patient);
    expect(service.getSelectedPatient().id).toBe(1);
  });

  it('THEN a patient and then clearing the selected patitent THEN it should no longer contain the patient', () => {
    const patient = {id: 1} as Patient;

    service.setSelectedPatient(patient);

    service.clearSelectedPatient();
    expect(service.hasSelectedPatient()).toBe(false);
  });

});
