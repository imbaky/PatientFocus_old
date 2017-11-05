import { PatientGuard } from './patient.guard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { SelectedPatientService } from '../../services/selected-patient/selected-patient.service';

describe('Patient Guard', () => {
  let service: PatientGuard;
  let MockRouter;
  let MockAuthService;
  let MockSelectedPatientService;

  beforeEach(() => {
    MockRouter = jasmine.createSpyObj(['navigate']);
    MockAuthService = jasmine.createSpyObj(['hasRole']);
    MockSelectedPatientService = jasmine.createSpyObj(['hasSelectedPatient']);

    const test = TestBed.configureTestingModule({
      providers: [
        PatientGuard,
        {
          provide: Router,
          useValue: MockRouter
        },
        {
          provide: AuthService,
          useValue: MockAuthService
        },
        {
          provide: SelectedPatientService,
          useValue: MockSelectedPatientService
        }
      ]
    });

    service = test.get(PatientGuard);
  });

  it('GIVEN a current patient user THEN the document route can be visited', () => {
    MockAuthService.hasRole.and.returnValue(true);

    expect(service.canActivate()).toBe(true);
    expect(MockAuthService.hasRole).toHaveBeenCalledWith('patient');
  });

  it('GIVEN a selected patient THEN the document route can be visited', () => {
    MockAuthService.hasRole.and.returnValue(false);
    MockSelectedPatientService.hasSelectedPatient.and.returnValue(true);

    expect(service.canActivate()).toBe(true);
  });

  it('GIVEN a current patient user THEN the document route can be visited', () => {
    MockAuthService.hasRole.and.returnValue(false);
    MockSelectedPatientService.hasSelectedPatient.and.returnValue(false);

    expect(service.canActivate()).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

});
