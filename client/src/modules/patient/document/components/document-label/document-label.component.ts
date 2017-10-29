import { Component, Input } from '@angular/core';

@Component({
  selector: 'document-label',
  templateUrl: 'document-label.component.html',
  styleUrls: ['./document-label.component.scss']
})

export class DocumentLabelComponent {

  @Input()
  label;

  constructor() { }

  get textColor(){
    return (parseInt(this.label.color, 16) > 0xffffff / 2) ? 'black' : 'white';
  }
}
