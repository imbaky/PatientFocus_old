import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// services
import { SelectedPatientService } from '../../services/selected-patient/selected-patient.service';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

@Injectable()
export class PatientGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private selectedPatient: SelectedPatientService,
  ) { }

  /**
   * Determines if a user can access the /document page.
   * @returns {boolean}
   */
  canActivate(): boolean {
    const hasPatient = this.authService.hasRole('patient') || this.selectedPatient.hasSelectedPatient();

    if (!hasPatient) {
      this.router.navigate(['/']);
      return hasPatient;
    }

    return true;
  }

}
