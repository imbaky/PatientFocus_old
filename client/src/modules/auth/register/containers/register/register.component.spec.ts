import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';

// components
import { RegisterComponent } from './register.component';
import { FormGroupComponent } from '../../../../core/ui/forms/components/form-group/form-group.component';
import { ShortStringComponent } from '../../../../core/ui/forms/containers/forms/short-string/short-string.component';
import { PillSelectorComponent } from '../../../../core/ui/forms/containers/forms/pill-selector/pill-selector.component';
import { CheckboxComponent } from '../../../../core/ui/forms/containers/forms/checkbox/checkbox.component';
import { ValidationMessageComponent } from '../../../../core/ui/forms/components/validation-message/validation-message.component';

// services
import { AuthService } from '../../../shared/services/auth/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class MockAuthService {
  registerUser(user) {
    return Observable.of({ success: true });
  }
}

describe('Register Component', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let el: DebugElement;
  let service: AuthService;
  let router: Router;
  let MockRouter;

  beforeEach(() => {
    MockRouter  = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        FormGroupComponent,
        RegisterComponent,
        ShortStringComponent,
        PillSelectorComponent,
        CheckboxComponent,
        ValidationMessageComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: MockRouter }
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    service = el.injector.get(AuthService);
    router = el.injector.get(Router);
  });

  it('GIVEN valid form values THEN it should register the user AND navigate to the home page.', () => {
    spyOn(service, 'registerUser').and.callThrough();

    component.form.patchValue({
      first_name: 'Tim',
      last_name: 'Lee',
      email: 'timlee@email.com',
      role: 'patient',
      password: '1234',
      accepted_terms: true
    });
    component.onRegister();

    expect(component.form.valid).toBe(true);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('GIVEN invalid form values THEN it should not register the user.', () => {
    spyOn(service, 'registerUser').and.callThrough();

    component.form.patchValue({
      first_name: '',
      last_name: 'Lee',
      email: 'timlee@email.com',
      role: 'patient',
      password: '1234',
      accepted_terms: false
    });
    component.onRegister();

    expect(component.form.valid).toEqual(false);
    expect(MockRouter.navigate).toHaveBeenCalledTimes(0);
  });

});
