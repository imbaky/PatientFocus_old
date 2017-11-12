import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../shared/services/auth/auth.service';

/**
 * Login Component
 */
@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  /**
   * Login form
   * @type {FormGroup}
   */
  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email ]],
    'password': ['', Validators.required ],
    'remain_signed_in': [false]
  });

  /**
   * Error
   * @type {any}
   */
  errors = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Logs in user if form is valid and response is ok
   */
  onLogin() {
    if (this.form.valid) {
      this.authService.loginUser(this.form.value)
        .subscribe(() => {
          this.authService.fetchCurrentUser();
          this.router.navigate(['/']);
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
