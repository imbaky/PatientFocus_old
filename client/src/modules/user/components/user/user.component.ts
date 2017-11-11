import { Component, OnInit } from '@angular/core';
import { AuthService, RoleType } from '../../../auth/shared/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PillSelectorOption } from '../../../core/ui/forms/containers/forms/pill-selector/pill-selector.component';

@Component({
  selector: 'user',
  styleUrls: ['./user.component.scss'],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  form: FormGroup;

  genderOptions: Array<PillSelectorOption> = [
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' }
  ];

  languageOptions: Array<PillSelectorOption> = [
    { label: 'English', value: 'en' },
    { label: 'French', value: 'fr' }
  ];

  yesNoOptions: Array<PillSelectorOption> = [
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  /**
   * Initializes the form
   */
  ngOnInit() {
    if (this.isPatient()) {
      this.form = this.fb.group({
        race: ['', Validators.required],
        gender: ['female', Validators.required],
        language: ['en', Validators.required],
        date_of_birth: ['', Validators.required],
        smoke: [false, Validators.required]
      });
    } else {
      this.form = this.fb.group({
        specialization: ['', Validators.required],
        license: ['', Validators.required]
      });
    }
  }

  /**
   * Determines if the user registered as patient
   * @returns {boolean}
   */
  isPatient(): boolean {
    return this.getRoleName() === 'patient';
  }

  /**
   * Returns the role type.
   * @returns {RoleType}
   */
  getRoleName(): RoleType {
    return this.authService.getRole().name;
  }

  /**
   * Registers the user's role.
   */
  registerRole() {
    if (this.form.valid) {
      const data = this.form.value;

      // TODO: mapping of frontend to backend.
      if (this.isPatient()) {
        data.dob = data.date_of_birth;
        delete data.date_of_birth;
      }

      this.authService.registerRole(this.getRoleName(), data).subscribe();
    }
  }

  /**
   * Determines if this is a new user.
   * @returns {boolean}
   */
  isNewUser(): boolean {
    return this.authService.getRole().id === -1;
  }

}
