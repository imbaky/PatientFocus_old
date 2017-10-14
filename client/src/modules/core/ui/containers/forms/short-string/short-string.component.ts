import {
  ChangeDetectionStrategy, Component, ElementRef, ExistingProvider, forwardRef, Input, OnInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const SELECTOR_CONTROL_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ShortStringComponent),
  multi: true,
};

@Component({
  selector: 'px-short-string',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ SELECTOR_CONTROL_ACCESSOR ],
  styleUrls: ['./short-string.component.scss'],
  templateUrl: './short-string.component.html'
})
export class ShortStringComponent implements ControlValueAccessor, OnInit {

  @Input()
  placeholder: string;

  @Input()
  type: string;

  @Input()
  hasError: boolean;

  @ViewChild('input')
  input: ElementRef;

  onTouch: Function;
  onModelChanges: Function;

  ngOnInit() {
    this.type = this.type || 'text';
    this.hasError=this.hasError||false;
  }

  registerOnChange(fn) {
    this.onModelChanges = fn;
  }

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  writeValue(value) {
    this.input.nativeElement.value = value;
  }

}
