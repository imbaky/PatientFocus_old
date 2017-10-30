import { Component, Input } from '@angular/core';

import { Label } from '../../../shared/services/label/label.service';

@Component({
  selector: 'document-label',
  templateUrl: 'document-label.component.html',
  styleUrls: ['./document-label.component.scss']
})
export class DocumentLabelComponent {

  @Input()
  label: Label;

  constructor() { }

  /**
   * Returns either black or white depending on the contrast level of the color
   */
  get textColor(){
    return (parseInt(this.label.color, 16) > 0xffffff / 2) ? 'black' : 'white';
  }
}
