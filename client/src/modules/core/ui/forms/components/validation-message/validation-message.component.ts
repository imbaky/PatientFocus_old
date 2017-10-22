import { Component, Input, OnInit } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
  selector: 'px-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent implements OnInit {

  @Input()
  controlName: string;

  @Input()
  onError: string;

  @Input()
  responseErrors: Object;

  formControl: AbstractControl;

  constructor(
    private forms: FormGroupDirective
  ) { }

  ngOnInit() {
    this.formControl = this.forms.form.get(this.controlName);
  }

  showsError(): boolean {
    return this.formControl.hasError(this.onError) && this.formControl.touched;
  }

}
