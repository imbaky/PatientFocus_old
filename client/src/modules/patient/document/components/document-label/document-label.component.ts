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

  /**
   * Returns either black or white depending on the contrast level of the color
   */
  get textColor(){
    const r = parseInt(this.label.color.substr(1, 2), 16);
    const g = parseInt(this.label.color.substr(3, 2), 16);
    const b = parseInt(this.label.color.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

}
