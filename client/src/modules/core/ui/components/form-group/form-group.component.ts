import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Link {
  href: string;
  message: string;
}

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

  @Input()
  link: Link;

}
