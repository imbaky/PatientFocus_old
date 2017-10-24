import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PillSelectorOption } from '../../../../core/ui/forms/containers/forms/pill-selector/pill-selector.component';
import { FormsValidators } from '../../../../core/ui/forms/validators/forms/forms.validators';
import { AuthService } from '../../../shared/services/auth/auth.service';

import 'rxjs/add/operator/catch';

@Component({
  selector: 'register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  roleOptions: Array<PillSelectorOption> = [
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' }
  ];

  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'first_name': ['', Validators.required],
    'last_name': ['', Validators.required],
    'role': ['patient'],
    'password': ['', Validators.required],
    'accepted_terms': [false, FormsValidators.isTrue() ]
  });

  errors = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onRegister() {
    if (this.form.valid) {
      this.authService.registerUser(this.form.value).subscribe(() => {
        this.router.navigate(['/']);
      }, (err) => {

      });
    }
  }

}
