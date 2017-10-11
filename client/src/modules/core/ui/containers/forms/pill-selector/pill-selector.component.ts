import { ChangeDetectionStrategy, Component, ExistingProvider, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const SELECTOR_CONTROL_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PillSelectorComponent),
  multi: true,
};

export interface PillSelectorOption {
  value: string;
  label: string;
}

@Component({
  selector: 'px-pill-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SELECTOR_CONTROL_ACCESSOR ],
  styleUrls: ['./pill-selector.component.scss'],
  templateUrl: './pill-selector.component.html'
})
export class PillSelectorComponent implements ControlValueAccessor {

  @Input()
  options: Array<PillSelectorOption>;

  onTouch: Function;
  onModelChanges: Function;

  value: string;

  registerOnChange(fn) {
    this.onModelChanges = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  writeValue(value) {
    if (!value) {
      throw new Error(`${PillSelectorComponent.name} requires a default option. None was provided.`);
    }

    const optionExists = this.options.find((option) => option.value === value);
    if (!optionExists) {
      throw new Error(`${PillSelectorComponent.name} requires an existing value option as default.`);
    }

    this.value = value;
  }

  selected(value) {
    this.value = value;

    this.onModelChanges(value);
    this.onTouch();
  }

}
