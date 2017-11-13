import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ValidationMessageComponent } from './validation-message.component';
import { DebugElement } from '@angular/core';
import { FormGroupDirective, FormControl, FormGroup, Validators } from '@angular/forms';

class MockFormGroupDirective {
  get form () {
    return new FormGroup({
      'email': new FormControl('', [Validators.required])
    });
  }
}

describe('Validation Message Component', () => {

  let component: ValidationMessageComponent;
  let fixture: ComponentFixture<ValidationMessageComponent>;
  let formDirective: FormGroupDirective;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidationMessageComponent
      ],
      providers: [
        { provide: FormGroupDirective, useClass: MockFormGroupDirective }
      ]
    });

    fixture = TestBed.createComponent(ValidationMessageComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    formDirective = el.injector.get(FormGroupDirective);
  });

  it('GIVEN an invalid form control THEN it should show error', () => {
    component.controlName = 'email';
    component.onError = 'required';
    component.ngOnInit();
    component.formControl.markAsTouched();

    expect(component.showsError()).toBe(true);
  });


  it('GIVEN an invalid form control THEN it should not show error', () => {
    component.controlName = 'email';
    component.onError = 'required';
    component.ngOnInit();

    expect(component.showsError()).toBe(false);
  });

});
