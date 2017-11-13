import { TestBed } from '@angular/core/testing';
import { PatientResolver } from './patient.resolver';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Patient, PatientService } from '../../services/patient/patient.service';
import { SelectedPatientService } from '../../services/selected-patient/selected-patient.service';
import { Observable } from 'rxjs/Observable';

describe('Selected Patient Service', () => {

  let service: PatientResolver;
  let MockAuthService;
  let MockPatientSerivce;
  let MockSelectedPatientService;

  beforeEach(() => {
    MockAuthService = jasmine.createSpyObj(['hasRole', 'getRole']);
    MockPatientSerivce = jasmine.createSpyObj(['getPatient']);
    MockSelectedPatientService = jasmine.createSpyObj(['getSelectedPatient']);

    const bed = TestBed.configureTestingModule({
      providers: [
        PatientResolver,
        {
          provide: AuthService,
          useValue: MockAuthService
        },
        {
          provide: PatientService,
          useValue: MockPatientSerivce
        },
        {
          provide: SelectedPatientService,
          useValue: MockSelectedPatientService
        }
      ],
    });
    service = bed.get(PatientResolver);
  });

  it('should resolve the patient with current authenticated patient', () => {
    MockAuthService.hasRole.and.returnValue(true);
    MockAuthService.getRole.and.returnValue({id: 2});
    MockPatientSerivce.getPatient.and.returnValue(Observable.of({id: 2}));

    service.resolve().subscribe((patient: Patient) => {
      expect(MockAuthService.hasRole).toHaveBeenCalledWith('patient');
      expect(patient.id).toBe(2);
    });
  });

  it('should resolve the patient with a non authenticated patient user', () => {
    MockAuthService.hasRole.and.returnValue(false);
    MockPatientSerivce.getPatient.and.returnValue(Observable.of({id: 2}));
    MockSelectedPatientService.getSelectedPatient.and.returnValue({id: 2});

    service.resolve().subscribe((patient: Patient) => {
      expect(MockAuthService.hasRole).toHaveBeenCalledWith('patient');
      expect(patient.id).toBe(2);
    });
  });

});
