import { AbstractControl } from '@angular/forms';

export class FormsValidators {

  static isTrue() {
    return FormsValidators.isEqualTo(true, 'isFalse');
  }

  static isEqualTo(value: any, validation?: string) {
    return (control: AbstractControl) => {
      return control.value === value ? null : { [validation || 'isNotEqual']: true };
    };
  }

}
