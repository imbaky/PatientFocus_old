import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PillSelectorOption } from '../../../../core/ui/forms/containers/forms/pill-selector/pill-selector.component';
import { FormsValidators } from '../../../../core/ui/forms/validators/forms/forms.validators';
import { AuthService } from '../../../shared/services/auth/auth.service';

import 'rxjs/add/operator/catch';

/**
 * Register component
 */
@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  /**
   * Array of role label and respective value
   * @type {Array<PillSelectorOption>}
   */
  roleOptions: Array<PillSelectorOption> = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' }
  ];

  /**
   * Registration form
   * @type {FormGroup}
   */
  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'first_name': ['', Validators.required],
    'last_name': ['', Validators.required],
    'role': ['patient'],
    'password': ['', Validators.required],
    'accepted_terms': [false, FormsValidators.isTrue() ]
  });

  /**
   * Error
   * @type {any}
   */
  errors = null;

  /**
   * Constructor
   * @param {FormBuilder} fb
   * @param {AuthService} authService
   * @param {Router} router
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Registers a user if all required fields are valid and response is ok
   */
  onRegister(): void {
    if (this.form.valid) {
      this.authService.registerUser(this.form.value).subscribe(() => {
        this.router.navigate(['/auth/login']);
      }, (err) => {

      });
    } else {
      for (const control in this.form.controls) {
        if (control) {
          this.form.get(control).markAsTouched();
          this.form.get(control).updateValueAndValidity();
        }
      }
    }
  }

}
