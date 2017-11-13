import { FormsValidators } from './forms.validators';
import { FormControl } from '@angular/forms';

describe('Forms Validators', () => {

  it('GIVEN an isTRUE validator WHEN the value is true THEN it should return null as a valid form control', () => {
    const control = new FormControl(true, FormsValidators.isTrue());

    expect(control.getError('isFalse')).toBeNull();
  });

  it('GIVEN an isTRUE validator WHEN the value is false THEN it should return an object as an invalid form control', () => {
    const control = new FormControl(false, FormsValidators.isTrue());

    expect(control.getError('isFalse')).toBeDefined();
  });

  it('GIVEN an isEqualTo validator WHEN the value is false THEN it should return an object as an invalid form control', () => {
    const control = new FormControl('laurendy', FormsValidators.isEqualTo('laurendy'));

    expect(control.getError('isNotEqual')).toBeNull();
  });

  it('GIVEN an isEqualTo validator validator WHEN the value is false THEN it should return an object as an invalid form control', () => {
    const control = new FormControl('laurendy', FormsValidators.isEqualTo('trump'));

    expect(control.getError('isNotEqual')).toBeDefined();
  });

});
