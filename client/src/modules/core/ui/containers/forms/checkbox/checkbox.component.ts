import { ChangeDetectionStrategy, Component, ElementRef, ExistingProvider, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const SELECTOR_CONTROL_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'px-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SELECTOR_CONTROL_ACCESSOR ],
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent implements ControlValueAccessor {

  @ViewChild('input')
  input: ElementRef;

  onTouch: Function;
  onModelChanges: Function;

  registerOnChange(fn) {
    this.onModelChanges = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  writeValue(value) {
    this.input.nativeElement.checked = value || false;
  }

}
