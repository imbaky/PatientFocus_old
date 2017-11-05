import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';

// components
import { LoginComponent } from './login.component';
import { FormGroupComponent } from '../../../../core/ui/forms/components/form-group/form-group.component';
import { ShortStringComponent } from '../../../../core/ui/forms/containers/forms/short-string/short-string.component';
import { CheckboxComponent } from '../../../../core/ui/forms/containers/forms/checkbox/checkbox.component';
import { ValidationMessageComponent } from '../../../../core/ui/forms/components/validation-message/validation-message.component';

// services
import { AuthService } from '../../../shared/services/auth/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

class MockAuthService {
  loginUser(user) {
    return Observable.of({ success: true });
  }
  fetchCurrentUser() {
    return Observable.of({ success: true });
  }
}

describe('Login Component', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
        LoginComponent,
        ShortStringComponent,
        CheckboxComponent,
        ValidationMessageComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: MockRouter }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    service = el.injector.get(AuthService);
    router = el.injector.get(Router);
  });

  it('GIVEN valid form values THEN it should login the user AND navigate to the home page.', () => {
    spyOn(service, 'loginUser').and.callThrough();
    spyOn(service, 'fetchCurrentUser').and.callThrough();

    component.form.patchValue({
      email: 'snowden@nsa.com',
      password: '123',
      remain_signed_in: true
    });
    component.onLogin();

    expect(component.form.valid).toBe(true);
    expect(MockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('GIVEN invalid form values THEN it should not login the user.', () => {
    spyOn(service, 'loginUser').and.callThrough();

    component.form.patchValue({
      email: 'snowden@nsa.com',
      password: '',
      remain_signed_in: true
    });
    component.onLogin();

    expect(component.form.valid).toBe(false);
    expect(MockRouter.navigate).toHaveBeenCalledTimes(0);
  });

});
