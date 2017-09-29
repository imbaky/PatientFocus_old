import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'px-form-group',
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss']
})
export class FormGroupComponent {

  @Input()
  label: string;

  @Input()
  help: string;

  doSomething(data: string) {
    console.log(data); // "DATA"
  }

}
