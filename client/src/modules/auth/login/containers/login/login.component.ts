import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Link } from '../../../../core/ui/components/form-group/form-group.component';
import { FormsValidators } from '../../../../core/ui/validators/forms/forms.validators';

@Component({
  selector: 'login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  forgotPassword: Link = { href: '/', message: 'Forgot password?' };

  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email ]],
    'password': ['', Validators.required ],
    'remain_signed_in': [false, FormsValidators.isTrue() ]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }
}
