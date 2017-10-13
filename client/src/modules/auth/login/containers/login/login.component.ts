import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FormsValidators } from '../../../../core/ui/validators/forms/forms.validators';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email ]],
    'password': ['', Validators.required ],
    'remain_signed_in': [false]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    if (this.form.valid) {
      this.authService.loginUser(this.form.value)
        .subscribe(() => {
          this.authService.fetchCurrentUser();
          this.router.navigate(['/']);
        }, (err) => {

        });
    }
  }
}
